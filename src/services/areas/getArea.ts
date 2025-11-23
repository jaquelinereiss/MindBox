import { supabase } from '../../lib/supabaseClient'

export interface Area {
  id: number
  area_name: string
}

export default async function getArea(): Promise<Area[]> {
  
    const { data, error } = await supabase
      .from('AREA')
      .select('id, area_name')

    if (error) {
      console.error("Erro ao buscar dados:", error)
    } else {
      console.log("Dados recebidos Area:", data)
    }

  return data as Area[]
}