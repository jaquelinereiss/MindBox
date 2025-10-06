import { supabase } from '../lib/supabaseClient'

export interface Subarea {
  id: number
  subarea_name: string
  id_area: number
}

export default async function getSubarea(idArea: number): Promise<Subarea[]> {
  
    const { data, error } = await supabase
      .from('SUBAREA')
      .select('id, subarea_name, id_area')
      .eq('id_area', idArea)

    if (error) {
      console.error("Erro ao buscar dados:", error)
    } else {
      console.log("Dados recebidos subArea:", data)
    }

  return data as Subarea[]
}