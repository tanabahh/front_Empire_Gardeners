<template>
    <div id="header">
        <h1>{{ title }}</h1>
        <div title="выполнила" id="credit">
           Выполнила: {{ authorName }}
        </div>

    </div>
</template>

<script>
    export default {
        name: "Header",
        props: {
            title: String,
            authorName: String,
        }
    }
</script>

<style scoped>
    #header {
        font:  italic 0.6em monospace;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        //position: fixed;
        color:  #000080;
        background-color: #87CEEB;
    }
    #credit {
        font-size: 2em;
        padding: 10px;
        margin: auto
    }
</style>