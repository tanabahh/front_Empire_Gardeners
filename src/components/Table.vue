<template>
    <table>
        <tr>
            <th>X</th>
            <th>Y</th>
            <th>R</th>
            <th>Результат</th>
            <th>Дата</th>
        </tr>
        <tr v-for="point in points" v-bind:key="point.x">
            <td>{{ point.x}}</td>
            <td>{{ point.y }}</td>
            <td>{{ point.r }}</td>
            <td>{{ point.hit}}</td>
            <td>{{ point.created}}</td>
        </tr>

    </table>
</template>

<script>
    export default {
        name: "Table",
        props: ['points'],
       mounted: function() {
       }
    }
</script>

<style scoped>
    table {width: 100%; border-collapse: separate; border-spacing: 4px; text-align: center;  background: #cbdfef;}
    th {color: #ffffff; font-weight: bold; border-radius: 4px 4px 0 0; background: #2e82c3;}
    td {color: #000080; border: 1px solid #2e82c3; border-radius: 4px; background: #cbdfef;}
    td:hover {background: #a2c3dd; transition-duration: 0.2s;}

</style>