import { supabase } from '../../lib/supabaseClient'
import { Box } from '../../types'

export default async function updateBox(id: number, updates: Partial<Box>): Promise<Box | null> {
    try {
        const { data, error } = await supabase
        .from('BOX')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

        if (error) throw error;

        return data as Box;
    } catch (err) {
        console.error('Erro ao atualizat o box:', err);
        return null;
    }
}