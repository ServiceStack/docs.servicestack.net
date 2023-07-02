#### index.html
```html
{{ 'requires-auth' | partial }}

{{#raw}}
<template>
    <v-layout justify-center>
        <v-flex xs6>
            <v-toolbar color="pink">
                <v-toolbar-title class="white--text">
                    {{ heading }}
                </v-toolbar-title>
            </v-toolbar>
            <v-card>
                <v-form v-model="valid" ref="form" lazy-validation @keyup.native.enter="submit">
                    <v-container>
                        <v-alert outline color="error" icon="warning" :value="errorSummary">{{ errorSummary }}</v-alert>
                        <v-layout column>

                            <v-radio-group 
                                    v-model="title"
                                    :error-messages="errorResponse('title')"
                                    row
                                ><v-radio
                                        v-for="x in contactTitles"
                                        :key="x.key"
                                        :label="x.value"
                                        :value="x.key"
                                ></v-radio>
                            </v-radio-group>                            

                            <v-text-field
                                    label="Name"
                                    v-model="name"
                                    required
                                    :rules="nameRules"
                                    :error-messages="errorResponse('name')"
                            ></v-text-field>

                            <v-select v-model="color"
                                      :items="contactColors"
                                      label="Favorite color"
                                      :error-messages="errorResponse('color')"
                                      solo
                            ></v-select>

                            <v-radio-group class="mb-3" :error-messages="errorResponse('filmGenres')">
                                <v-checkbox
                                        v-for="x in contactGenres"
                                        v-model="filmGenres"
                                        :key="x"
                                        :label="x"
                                        :value="x"
                                ></v-checkbox>
                            </v-radio-group>

                            <v-layout>
                                <v-flex xs4>
                                    <v-text-field
                                            v-model="age"
                                            class="mt-0"
                                            label="Age"
                                            type="number"
                                            :error-messages="errorResponse('age')"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>

                            <v-checkbox v-if="!update"
                                    label="Agree to terms and conditions" 
                                    v-model="agree"
                                    :value="true"
                                    :rules="[v => v || 'You must agree to our terms']"
                                    :error-messages="errorResponse('agree')"
                            ></v-checkbox>

                        </v-layout>
                    </v-container>
                </v-form>
                <v-card-actions>
                    <v-flex>
                        <v-btn large class="mb-2" color="primary" @click="submit" :disabled="!valid || loading">
                            {{ action }}
                        </v-btn>
                        <v-btn flat @click="reset">reset</v-btn>
                        <v-btn v-if="update" flat @click="cancel">cancel</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
            <v-flex>
                <v-toolbar>
                    <v-toolbar-title>
                        Contacts
                    </v-toolbar-title>
                </v-toolbar>
                <v-card>
                    <v-layout v-for="c in contacts" :key="c.id" :style="`background:${c.color}`">
                        <v-flex>
                            <h3 class="pa-3 title">{{c.title}} {{c.name}} ({{c.age}})</h3>
                        </v-flex>
                        <v-btn flat @click="edit(c.id)">edit</v-btn>
                        <v-btn @click="remove(c.id)">delete</v-btn>
                    </v-layout>
                    <v-layout v-if="!contacts.length">
                        <v-flex>
                            <h3 class="pa-3 title">There are no contacts.</h3>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>

            <div class="src">
                <h4>Source Code and References</h4>
                <div><a href="https://github.com/NetCoreApps/Validation/blob/master/world/wwwroot/vuetify/_layout.html" class="ref">/vuetify/_layout.html</a></div>
                <div><a href="https://github.com/NetCoreApps/Validation/blob/master/world/wwwroot/vuetify/contacts/index.html" class="ref">/vuetify/contacts/index.html</a></div>
                <div><a href="https://github.com/NetCoreApps/Validation/blob/master/world/wwwroot/vuetify/contacts/index.ts" class="ref">/vuetify/contacts/index.ts</a></div>
                <div><a href="https://github.com/NetCoreApps/Validation/blob/master/world/wwwroot/dtos.ts" class="ref">/dtos.ts</a></div>
            </div>
        </v-flex>
    </v-layout>

</template>
{{/raw}}


{{#capture appendTo scripts}}
<script>
var colors = {{ contactColors | json }};
var DATA = {
    contacts: {{ sendToGateway('GetContacts') | map => it.Results | json }},
    contactTitles: {{ contactTitles | json }},
    contactColors: Object.keys(colors).map(k => ({ text:colors[k], value:k })),
    contactGenres: {{ contactGenres | json }}
};
</script>
<script src="index.js"></script>
{{/capture}}
```

#### index.ts
```ts
import { Vue } from 'vue';
import { errorResponse, errorResponseExcept, queryString } from '@servicestack/client';
import { client, nameRules, } from '../shared';
import {CreateContact, DeleteContact, GetContact, GetContacts, Title, UpdateContact} from '../../dtos';

declare var DATA:any;

new Vue({
    el: '#app',
    computed: {
        heading: function() {
            return this.update ? 'Edit new Contact' : 'Add new Contact';
        },
        action: function() {
            return this.update? 'Update Contact' : 'Add Contact';
        },
        errorSummary: function() {
            return errorResponseExcept.call(this, 'title,name,color,filmGenres,age,agree');
        },
    },
    methods: {
        async submit() {
            const form = (this.$refs.form as HTMLFormElement); 
            if (form.validate()) {
                try {
                    this.loading = true;
                    
                    const request = {
                        title: this.title as Title,
                        name: this.name,
                        color: this.color,
                        filmGenres: this.filmGenres,
                        age: this.age,
                    };
                    
                    if (this.update) {
                        await client.post(new UpdateContact({...request, id: this.id }));
                    } else {
                        await client.post(new CreateContact({...request, agree: this.agree }));
                    }

                    this.update = false;
                    this.responseStatus = null;
                    form.reset();
                    
                } catch (e) {
                    this.responseStatus = e.responseStatus || e;
                } finally {
                    this.loading = false;
                    form.resetValidation();
                }
                await this.refresh();
            }
        },
        async refresh() {
            this.contacts = (await client.get(new GetContacts())).results;
        },
        reset() {
            (this.$refs.form as HTMLFormElement).reset();
        },
        cancel() {
            this.reset();
            this.update = false;
        },
        async edit(id:number) {
          this.update = true;
          const contact = (await client.get(new GetContact({ id }))).result;
          Object.assign(this, contact);
        },
        async remove(id:number) {
            if (!confirm('Are you sure?'))
                return;

            await client.delete(new DeleteContact({ id }));
            const response = await client.get(new GetContacts());
            await this.refresh();
        },
        errorResponse
    },
    async mounted() {
        const qs = queryString(location.href);
        if (qs['id'])
            await this.edit(parseInt(qs['id']))
    },
    data: () => ({
        loading: false,
        valid: true,
        update: false, 
        ...DATA,

        id:0,
        title: "",
        name: "",
        color: "",
        filmGenres: [],
        age: 13,
        agree: false,
        nameRules,
        responseStatus: null
    }),
});
```