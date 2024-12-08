<template>
  <div class="pa-4 text-center">
    <v-dialog width="auto" scrollable>
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          color="brown"
          prepend-icon="mdi-order-bool-ascending"
          text="Ordenar"
          variant="outlined"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card prepend-icon="mdi-order-bool-ascending" title="Ordenar Categorias" style="min-width: 350px;">
          <v-divider class="mt-3"></v-divider>

          <ul>
            <li
              v-for="(item, index) in items"
              :key="index"
              :data-index="index"
              :class="{ dragging: index === currentDraggedIndex }"
              draggable="true"
              @dragstart="onDragStart(index)"
              @dragover.prevent="onDragOver(index)"
              @drop="onDrop(index)"
              @touchstart="onTouchStart($event, index)"
              @touchmove="onTouchMove($event)"
              @touchend="onTouchEnd()"
            >
              {{ item.nome }}
            </li>
          </ul>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn color="red" variant="outlined" text="Close" @click="isActive.value = false"></v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text="Save"
              variant="flat"
              @click="() => {
                salvar();
                isActive.value = false;
              }"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType, inject } from "vue";
import { IProductsControllers } from "@/controllers/interfaces/IProductsControllers";
import { CategoryProducts } from "@/models/entities/CategoryProducts";

const productsControllers = inject<IProductsControllers>("productsControllers");
if (!productsControllers) {
  throw new Error("AuthUserControllers not provided");
}

const props = defineProps({
  items: {
    type: Array as PropType<CategoryProducts[]>,
  },
});

const currentDraggedIndex = ref<number | null>(null);
const touchStartIndex = ref<number | null>(null);

// Eventos Desktop (Drag and Drop)
const onDragStart = (index: number) => {
  currentDraggedIndex.value = index;
};

const onDragOver = (index: number) => {};

const onDrop = (index: number) => {
  if (currentDraggedIndex.value !== null && currentDraggedIndex.value !== index) {
    reorderItems(currentDraggedIndex.value, index);
  }
  currentDraggedIndex.value = null;
};

// Eventos Mobile (Touch)
const onTouchStart = (event: TouchEvent, index: number) => {
  touchStartIndex.value = index;
};

const onTouchMove = (event: TouchEvent) => {
  event.preventDefault();
  const touch = event.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
  if (target?.dataset?.index) {
    const targetIndex = parseInt(target.dataset.index);
    if (touchStartIndex.value !== null && touchStartIndex.value !== targetIndex) {
      reorderItems(touchStartIndex.value, targetIndex);
      touchStartIndex.value = targetIndex;
    }
  }
};

const onTouchEnd = () => {
  touchStartIndex.value = null;
};

// Reordena os itens
const reorderItems = (fromIndex: number, toIndex: number) => {
  if (!props.items) return;
  const draggedItem = props.items.splice(fromIndex, 1)[0];
  props.items.splice(toIndex, 0, draggedItem);

  // Atualiza os índices
  props.items.forEach((item, i) => (item.index = i + 1));
};

const salvar = async () => {
  if (props.items) {
    await productsControllers.editarCategoriaLote(props.items);
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  background: #fff;
  margin: 5px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: grab;
  transition: transform 0.2s, box-shadow 0.2s;
}

li.dragging {
  opacity: 0.6;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
