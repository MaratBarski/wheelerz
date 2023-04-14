import { bootstrapApplication } from '@angular/platform-browser'
import { AppComponent } from './app/app.component'
import { importProvidersFrom } from '@angular/core'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router'
import { APP_ROUTES } from './app/app.routes'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DatePickerConfig } from './app/models/dates'
import { TokenInterceptorService } from './app/services/token-interceptor.service'
import { AngularEditorModule } from '@kolkov/angular-editor'

bootstrapApplication(AppComponent, {
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true,
        },
        { provide: DatePickerConfig, useValue: DatePickerConfig },
        importProvidersFrom(HttpClientModule, BrowserAnimationsModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(RouterModule.forRoot(APP_ROUTES)),
        importProvidersFrom(AngularEditorModule)
    ]
}).then(() => console.log('start app')).catch((er) => console.log(er))
