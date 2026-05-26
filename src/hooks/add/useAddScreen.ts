import { useEffect, useState } from "react";
import { RootStackParamList } from "../../navigation/types";
import { Box } from "../../types/Box";
import getArea, { Area } from "../../services/areas/getArea";
import getSubarea, { Subarea } from "../../services/areas/getSubarea";
import getBoxes from "../../services/boxes/getBoxes";
import insertBox from "../../services/boxes/insertBox";
import insertItem from "../../services/items/insertItem";
import { useToast } from "../../components/feedback/ToastContext";
import { useBox } from "../box/useBox";
import { useItem } from "../item/useItem";
import { useSelectModal } from "../modal/useSelectModal";

export function useAddScreen(
  navigate: (screen: keyof RootStackParamList, params?: any) => void,
) {
  const [tab, setTab] = useState<"Box" | "Item">("Box");
  const [areas, setAreas] = useState<Area[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number>();
  const box = useBox();
  const item = useItem();
  const selectModal = useSelectModal();
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const areasData = await getArea();
      const boxesData = await getBoxes();

      setAreas(areasData);
      setBoxes(boxesData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  };

  const openAreaModal = () => {
    const areaOptions = areas.map((area) => area.area_name);

    selectModal.openModal(areaOptions, (selectedAreaName: string) => {
      const selectedArea = areas.find(
        (area) => area.area_name === selectedAreaName,
      );

      if (!selectedArea) return;

      box.setArea(selectedArea.area_name);

      setSelectedAreaId(selectedArea.id);

      selectModal.closeModal();
    });
  };

  const openBoxForItemModal = () => {
    const boxOptions = boxes.map((box) => box.box_title);

    selectModal.openModal(boxOptions, async (selectedBoxTitle: string) => {
      item.setBox(selectedBoxTitle);

      const selectedBox = boxes.find((box) => box.box_title === selectedBoxTitle,);

      if (!selectedBox) {
        item.setSubareaOptions([]);
        item.setSubarea(null);

        return;
      }

      const subareas: Subarea[] = (await getSubarea(selectedBox.box_area)) ?? [];

      item.setSubareaOptions( 
        subareas.map((subarea) => subarea.subarea_name)
      );

      item.setSubarea(null);

      selectModal.closeModal();
    });
  };

  const openSubareaModal = () => {
    if (!item.subareaOptions.length) {
      return;
    }

    selectModal.openModal(
      item.subareaOptions,
      (selectedSubarea: string) => {
        item.setSubarea(selectedSubarea);

        selectModal.closeModal();
      },
    );
  };

  const handleCreateBox = async () => {
    if (!box.validate()) { return; }

    try {
      await insertBox(
        box.title.trim(),
        box.description.trim(),
        selectedAreaId,
        box.getFormattedDeadline(),
      );

      box.reset();

      showToast("Box cadastrado com sucesso!");

      setTimeout(() => {
        navigate("Boxes");
      }, 1000);
    } catch (err) {
      console.error(err);

      showToast("Ops! Erro ao cadastrar box.");
    }
  };

  const handleAddItem = async () => {
    if (!item.validate(box.deadline)) {
      return;
    }

    const selectedBox = boxes.find((box) => box.box_title === item.box);

    if (!selectedBox) {
      item.setError("Box inválido! Escolha uma opção da lista.");

      return;
    }

    const subareas: Subarea[] = await getSubarea(selectedBox.box_area);

    const selectedSubarea = subareas.find(
      (subarea) => subarea.subarea_name === item.subarea,
    );

    try {
      await insertItem(
        item.title,
        item.description || "",
        item.priority ? Number(item.priority) : undefined,
        box.getFormattedDeadline(),
        selectedBox.id,
        selectedSubarea?.id ?? 0,
      );

      item.reset();

      box.setDeadline("");

      showToast("Item adicionado com sucesso!");
    } catch (err) {
      console.error(err);

      showToast("Ops! Erro ao adicionar o item.");
    }
  };

  return {
    tab,
    setTab,
    box,
    item,
    selectModal,
    openAreaModal,
    openBoxForItemModal,
    openSubareaModal,
    handleCreateBox,
    handleAddItem,
  };
}
