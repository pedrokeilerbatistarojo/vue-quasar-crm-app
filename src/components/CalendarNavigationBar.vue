<template>
    <div class="row justify-center">
        <div class="q-pa-md q-gutter-sm row">
            <q-btn no-caps class="button" style="margin: 2px;" @click="$emit('prev')">
                &lt;
            </q-btn>
            <q-btn no-caps class="button" style="margin: 2px;" @click="$emit('today')">
                Hoy
            </q-btn>
            <q-btn no-caps class="button" style="margin: 2px;" @click="$emit('next')">
                &gt;
            </q-btn>
        </div>
    </div>
</template>