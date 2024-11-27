import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment.dev';

(window as any).ENV = environment;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
