import { Bulletin, BulletinFormData } from '../types';
import { supabase } from './supabaseClient';

export const getBulletins = async (): Promise<Bulletin[]> => {
  try {
    const { data, error } = await supabase
      .from('bulletins')
      .select('*')
      .order('publish_date', { ascending: false });

    if (error) {
      console.error('Error fetching bulletins:', error.message || error);
      return [];
    }

    // Map database columns (snake_case) to app types (camelCase)
    // Handle case where data might be null despite no error (though unlikely in Supabase)
    const mappedData = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      publishDate: item.publish_date,
      driveLink: item.drive_link,
      summary: item.summary
    }));

    // Ensure strict sorting by date descending (Newest first)
    return mappedData.sort((a: Bulletin, b: Bulletin) => {
      const dateA = new Date(a.publishDate).getTime();
      const dateB = new Date(b.publishDate).getTime();
      // Handle invalid dates safely
      const validDateA = isNaN(dateA) ? 0 : dateA;
      const validDateB = isNaN(dateB) ? 0 : dateB;
      return validDateB - validDateA;
    });
  } catch (err) {
    console.error('Unexpected error in getBulletins:', err);
    return [];
  }
};

export const saveBulletin = async (data: BulletinFormData, existingId?: string, summary?: string): Promise<Bulletin | null> => {
  const payload = {
    title: data.title,
    publish_date: data.publishDate,
    drive_link: data.driveLink,
    summary: summary || ''
  };

  let resultData;
  let error;

  try {
    if (existingId) {
      // Update
      const response = await supabase
        .from('bulletins')
        .update(payload)
        .eq('id', existingId)
        .select()
        .single();
      
      resultData = response.data;
      error = response.error;
    } else {
      // Insert
      const response = await supabase
        .from('bulletins')
        .insert(payload)
        .select()
        .single();
      
      resultData = response.data;
      error = response.error;
    }

    if (error) {
      console.error('Error saving bulletin:', error.message || error);
      throw new Error(error.message || 'Database error');
    }
    
    if (!resultData) {
      throw new Error('No data returned from save operation');
    }

    return {
      id: resultData.id,
      title: resultData.title,
      publishDate: resultData.publish_date,
      driveLink: resultData.drive_link,
      summary: resultData.summary
    };
  } catch (err: any) {
    console.error('Exception saving bulletin:', err);
    throw err;
  }
};

export const deleteBulletin = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bulletins')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting bulletin:', error.message || error);
      throw new Error(error.message || 'Database error');
    }
  } catch (err: any) {
    console.error('Exception deleting bulletin:', err);
    throw err;
  }
};