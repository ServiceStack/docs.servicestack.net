#### login.html
```html
{{#raw}}
<template>
<v-layout justify-center>
    <v-flex xs5>
        <v-toolbar color="pink">
            <v-toolbar-title class="white--text">
                Sign In using credentials
            </v-toolbar-title>
        </v-toolbar>
        <v-card>
            <v-form v-model="valid" ref="form" lazy-validation @keyup.native.enter="submit">
                <v-container>
                    <v-alert outline color="error" icon="warning" :value="errorSummary">{{ errorSummary }}</v-alert>
                    <v-layout column>

                        <v-text-field
                                label="Email"
                                v-model="userName"
                                required
                                :rules="emailRules"
                                :error-messages="errorResponse('userName')"
                        ></v-text-field>

                        <v-text-field
                                label="Password"
                                v-model="password"
                                type="password"
                                required
                                :rules="passwordRules"
                                :error-messages="errorResponse('password')"
                        ></v-text-field>

                        <v-checkbox label="Remember Me" v-model="rememberMe"></v-checkbox>

                    </v-layout>
                </v-container>
            </v-form>
            <v-card-actions>
                <v-flex offset-xs2 mb-2>
                    <v-btn flat href="/vuetify/register" :disabled="!valid || loading">Register New User</v-btn>
                    <v-btn color="primary" @click="submit" :disabled="!valid || loading">Sign In</v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
        <v-flex>
            <v-toolbar>
                <v-toolbar-title>
                    Quick Login
                </v-toolbar-title>
            </v-toolbar>
            <v-card>
                <v-layout>
                    <v-flex>
                        <v-btn @click="switchUser('admin@email.com')" flat>admin@email.com</v-btn>
                    </v-flex>
                    <v-flex>
                        <v-btn @click="switchUser('new@user.com')" flat>new@user.com</v-btn>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>

        <div class="src">
            <h4>Source Code and References</h4>
            <div><a href="https://github.com/NetCoreApps/Validation/blob/master/world/wwwroot/vuetify/_layout.html" class="ref">/vuetify/_layout.html</a></div>
            <div><a href="https://github.com/NetCoreApps/Validation/blob/master/world/wwwroot/vuetify/login.html" class="ref">/vuetify/login.html</a></div>
            <div><a href="https://github.com/NetCoreApps/Validation/blob/master/world/wwwroot/vuetify/login.ts" class="ref">/vuetify/login.ts</a></div>
        </div>
    </v-flex>
</v-layout>
</template>
{{/raw}}

{{#capture appendTo scripts}}
<script>var CONTINUE = '{{ qs.redirect ?? "/vuetify/" }}';</script>
<script src="login.js"></script>
{{/capture}}
```

#### login.ts
```ts
import { Vue } from 'vue';
import { errorResponse, errorResponseExcept } from '@servicestack/client';
import { client, emailRules, passwordRules } from './shared';
import { Authenticate } from "../dtos";

declare var CONTINUE:any;

new Vue({
    el: '#app',
    computed: {
        errorSummary: function() {
            return errorResponseExcept.call(this, 'userName,password');
        }, 
    },
    methods: {
        async submit() {
            const form = (this.$refs.form as HTMLFormElement);
            if (form.validate()) {
                try {
                    this.loading = true;

                    const response = await client.post(new Authenticate({
                        provider: 'credentials',
                        userName: this.userName,
                        password: this.password,
                        rememberMe: this.rememberMe,
                    }));

                    location.href = CONTINUE;
                } catch (e) {
                    this.responseStatus = e.responseStatus || e;
                } finally {
                    this.loading = false;
                    form.resetValidation();
                }
            }
        },
        switchUser(email:string) {
            this.userName = email;
            this.password = 'p@55wOrd';
        },
        errorResponse
    },
    data: () => ({
        loading: false,
        valid: true,
        userName: "",
        password: "",
        rememberMe: true,
        emailRules, passwordRules,
        responseStatus: null
    }),
});
```