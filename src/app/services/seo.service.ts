import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { API_ROUTE, CONSTANTS } from 'src/app/models/constants';
@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private title: Title,
    private httpClient: HttpClient,
    private meta: Meta
  ) {}

  updatePropertySeo(slug: string) {
    this.getSeo(slug, 1).subscribe({
      next: (res: any) => {
        if (res.status == 'success') {
          if (res.data?.MetaTitle) {
            this.updateTitle(res.data?.MetaTitle);
          }
          if (res.data?.MetaKeywords) {
            this.updateKeyword(res.data?.MetaKeywords);
          }
          if (res.data?.MetaDescription) {
            this.updateDescription(res.data?.MetaDescription);
          }
        }
      },
    });
  }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }
  updateSeo(title: string, keywords: string, desc: string) {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'description', content: desc });
  }

  updateKeywordDesc(keywords: string, desc: string) {
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'description', content: desc });
  }

  updateKeyword(keywords: string) {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  updateDescription(desc: string) {
    this.meta.updateTag({ name: 'description', content: desc.replace(/<[^>]*>/g, '') });
  }

  getSeo(slug: string, type: any) {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.SEO_URL
    }?Slug=${slug}&Type=${type}`;
    return this.httpClient.get(url, {
      headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
    });
  }

  updatePropertyEQSeo(slug: string) {
    this.getPropertyEQSeo(slug, 1).subscribe({
      next: (res: any) => {
        if (res.status == 'success') {
          if (res.data?.MetaTitle) {
            this.updateTitle(res.data?.MetaTitle);
          }
          if (res.data?.MetaKeywords) {
            this.updateKeyword(res.data?.MetaKeywords);
          }
          if (res.data?.MetaDescription) {
            this.updateDescription(res.data?.MetaDescription);
          }
        }
      },
    });
  }

  updatePropertyEQSeoDetails(slug: string,type:number) {
    this.getPropertyEQSeo(slug, type).subscribe({
      next: (res: any) => {
        if (res.status == 'success') {
          if (res.data?.MetaTitle) {
            this.updateTitle(res.data?.MetaTitle);
          }
          if (res.data?.MetaKeywords) {
            this.updateKeyword(res.data?.MetaKeywords);
          }
          if (res.data?.MetaDescription) {
            this.updateDescription(res.data?.MetaDescription);
          }
        }
      },
    });
  }
  getPropertyEQSeo(slug: string, type: any) {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.PROPERTY_EQ_SEO_URL
    }?Slug=${slug}&?Type=${type}`;
    return this.httpClient.get(url, {
      headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
    });
  }
}
