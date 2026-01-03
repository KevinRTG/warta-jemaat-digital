import { Bulletin, BulletinFormData } from '../types';
import { supabase } from './supabaseClient';

export const getBulletins = async (): Promise<Bulletin[]> => {
  const { data, error } = await supabase
    .from('bulletins')
    .select('*')
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching bulletins:', error);
    return [];
  }

  // Map database columns (snake_case) to app types (camelCase)
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    publishDate: item.publish_date,
    driveLink: item.drive_link,
    summary: item.summary
  }));
};

export const saveBulletin = async (data: BulletinFormData, existingId?: string, summary?: string): Promise<Bulletin | null> => {
  const payload = {
    title: data.title,
    publish_date: data.publishDate,
    drive_link: data.driveLink,
    summary: summary || ''
  };

  if (existingId) {
    // Update
    const { data: result, error } = await supabase
      .from('bulletins')
      .update(payload)
      .eq('id', existingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating bulletin:', error);
      throw error;
    }
    
    return {
      id: result.id,
      title: result.title,
      publishDate: result.publish_date,
      driveLink: result.drive_link,
      summary: result.summary
    };
  } else {
    // Insert
    const { data: result, error } = await supabase
      .from('bulletins')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error saving bulletin:', error);
      throw error;
    }

    return {
      id: result.id,
      title: result.title,
      publishDate: result.publish_date,
      driveLink: result.drive_link,
      summary: result.summary
    };
  }
};

export const deleteBulletin = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('bulletins')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting bulletin:', error);
    throw error;
  }
};
