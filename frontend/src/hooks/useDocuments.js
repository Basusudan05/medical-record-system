import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * useDocuments
 * Centralised data layer for medical_records operations.
 * All Supabase calls go through this hook so pages stay thin.
 *
 * Returns:
 *   documents   – array of medical_records rows
 *   loading     – fetch in progress
 *   error       – last fetch error string or null
 *   fetchDocuments(userId)
 *   uploadDocument({ userId, file, category, documentName })
 *   deleteDocument({ recordId, storagePath })
 *   getSignedUrl(storagePath)        – returns a 60-second signed URL
 */
export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  // ── Fetch all records for a user ─────────────────────────────
  const fetchDocuments = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', userId)
        .order('created_at', { ascending: false });

      if (err) {
        setError(err.message);
        setDocuments([]);
      } else {
        setDocuments(data || []);
      }
    } catch (e) {
      setError(e.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Upload a file + insert DB row ────────────────────────────
  const uploadDocument = useCallback(async ({
    userId,
    file,
    category,
    documentName,
  }) => {
    // 1. Build a unique storage path: userId/timestamp_filename
    const ext       = file.name.split('.').pop().toLowerCase();
    const timestamp = Date.now();
    const safeName  = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${userId}/${timestamp}_${safeName}`;

    // 2. Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('medical-documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (storageError) {
      return { success: false, error: storageError.message };
    }

    // 3. Insert metadata row into medical_records
    const { data: record, error: dbError } = await supabase
      .from('medical_records')
      .insert({
        patient_id:        userId,
        document_name:     documentName || file.name,
        document_type:     category,
        file_path:         storagePath,
        original_file_type: file.type,
        file_size_kb:      Math.round(file.size / 1024),
        file_size_bytes:   file.size,
        processing_status:   'pending',
        verification_status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      // Attempt to clean up orphaned storage file
      await supabase.storage.from('medical-documents').remove([storagePath]);
      return { success: false, error: dbError.message };
    }

    return { success: true, record };
  }, []);

  // ── Delete a record and its storage file ─────────────────────
  const deleteDocument = useCallback(async ({ recordId, storagePath }) => {
    // 1. Delete from storage first
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('medical-documents')
        .remove([storagePath]);
      if (storageError) {
        console.warn('[useDocuments] storage delete failed:', storageError.message);
        // Continue — still delete the DB row
      }
    }

    // 2. Delete the database record (RLS ensures ownership)
    const { error: dbError } = await supabase
      .from('medical_records')
      .delete()
      .eq('id', recordId);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // 3. Remove from local state immediately
    setDocuments(prev => prev.filter(d => d.id !== recordId));
    return { success: true };
  }, []);

  // ── Get a short-lived signed URL (60 seconds) ─────────────────
  const getSignedUrl = useCallback(async (storagePath) => {
    if (!storagePath) return null;
    const { data, error } = await supabase.storage
      .from('medical-documents')
      .createSignedUrl(storagePath, 60);     // 60 seconds

    if (error) {
      console.error('[useDocuments] getSignedUrl:', error.message);
      return null;
    }
    return data.signedUrl;
  }, []);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    getSignedUrl,
    setDocuments,
  };
}
