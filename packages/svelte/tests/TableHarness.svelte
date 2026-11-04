<script lang="ts">
  import { DataTable, type DataTableSort } from "../src/index.ts";

  interface Person {
    id: string;
    name: string;
  }

  interface Props {
    onSort: (columnId: string, direction: string) => void;
  }
  let { onSort }: Props = $props();

  const rows: Person[] = [
    { id: "1", name: "Ada" },
    { id: "2", name: "Grace" },
  ];
  let selected: string[] = $state([]);
</script>

<DataTable
  caption="People"
  {rows}
  columns={[{ id: "name", header: "Name", sortable: true }]}
  sort={{ columnId: "name", direction: "ascending" }}
  onSortChange={(s: DataTableSort) => {
    onSort(s.columnId, s.direction);
  }}
  {selected}
  onSelectedChange={(next: string[]) => {
    selected = next;
  }}
  selectAllLabel="Select all"
  selectRowLabel={(r: Person) => `Select ${r.name}`}
>
  {#snippet cell(row: Person)}{row.name}{/snippet}
</DataTable>
