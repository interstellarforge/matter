<script lang="ts">
  import { KanbanBoard, SortableList, StatCard } from "../src/index.ts";
  import type { KanbanColumn, KanbanMove, SortableMove } from "../src/types.ts";

  interface Person {
    id: string;
    name: string;
  }
  interface Props {
    onReorder: (ids: string[]) => void;
    onMove: (move: KanbanMove) => void;
  }
  let { onReorder, onMove }: Props = $props();

  const ada: Person = { id: "a", name: "Ada" };
  const grace: Person = { id: "b", name: "Grace" };
  const linus: Person = { id: "c", name: "Linus" };
  const people = [ada, grace, linus];
  const columns: KanbanColumn<Person>[] = [
    { id: "todo", title: "To do", items: [ada, grace] },
    { id: "done", title: "Done", items: [linus] },
  ];
</script>

<StatCard label="Open roles" value="284" description="From 4 sources" />

<SortableList
  label="Sections"
  items={people}
  onReorder={(move: SortableMove) => {
    onReorder(move.ids);
  }}
  gripLabel={(person: Person) => `Move ${person.name}`}
  announceMove={(person: Person, n: number, total: number) =>
    `${person.name}, ${String(n)} of ${String(total)}`}
>
  {#snippet item(person: Person)}{person.name}{/snippet}
</SortableList>

<KanbanBoard
  label="Pipeline"
  {columns}
  {onMove}
  gripLabel={(person: Person) => `Move ${person.name} card`}
  announceMove={(person: Person, column: KanbanColumn<Person>, n: number, total: number) =>
    `${person.name} to ${column.title}, ${String(n)} of ${String(total)}`}
>
  {#snippet card(person: Person)}{person.name}{/snippet}
</KanbanBoard>
