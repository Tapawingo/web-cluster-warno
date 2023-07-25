<template>
    <div class="background">
        <div class="warno-container typewritten" ref="paper">
            <h1 class="warno-header" v-if="!error">WARNING ORDER</h1>
            <h1 class="warno-header" v-if="error">ERROR</h1>
            <div class="warno-buttonrow" v-if="!error">
                <button class="warno-previous" :class="{ show: (pageIndex != 0) }" @click="previousPage">Previous Page</button>
                <button class="warno-next" :class="{ show: (pageIndex != numPages) }" @click="nextPage">Next Page</button>
            </div>
            <div v-for="section, index in data" v-if="!error">
                <div class="warno-section" :class="{ show: (index == pageIndex) }">
                    <h1>{{ indexHeader[index] }}</h1>
                    <ol class="warno-content" v-html="section"></ol>
                </div>
            </div>
            <div class="error-container">
                <h1 v-if="error">Status Code: {{ error.statusCode }}</h1>
                <p class="warno-content" v-if="error"><pre>{{ error.data }}</pre></p>
            </div>
        </div>
    </div>
    <div class="foreground">
        <div class="foreground-inner-1">
            <div class="light">
                <div class="shadow"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useRoute } from 'vue-router'
    const route = useRoute();
    
    const { data, pending, error, refresh } = await useFetch('/api/getWarno?warno='+route.params.warno)

    if (!route.params.warno) {
        error.value = { statusCode: 400, data: "Missing query parameter: warno" };
    }
    
    if (!data.value) {
        data.value = [];
    }

    const indexHeader = ["Situation", "Mission", "Execution", "Administration & Logistics", "Command & Signal"];

    const pageIndex = ref(0);
    const numPages = (data.value as Array<string>).length - 1;

    /* Open next page */
    const nextPage = (event: MouseEvent) => {
        if (pageIndex.value != numPages) {
            pageIndex.value++;
            
            /* Play Audio */
            const audio = new Audio('sounds/flip_page_'+Math.floor(Math.random() * 8 + 1)+'.mp3');
            audio.play();
        };
    };

    /* Open previous page */
    const previousPage = (event: MouseEvent) => {
        if (pageIndex.value != 0) {
            pageIndex.value--;

            /* Play Audio */
            const audio = new Audio('sounds/flip_page_'+Math.floor(Math.random() * 8 + 1)+'.mp3');
            audio.play();
        }
    };

</script>