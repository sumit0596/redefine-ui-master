import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-propertyeq-search',
  templateUrl: './propertyeq-search.component.html',
  styleUrls: ['./propertyeq-search.component.scss']
})
export class PropertyeqSearchComponent implements OnInit {
  s = '';
  currentURL = '';
  table = '';
  pageNumber: number = 1;
  pageSize = 3;
  totalRowsCount = 0;
  pageCnt = 0;
  loadMore = 0;
  searchData: any = [];
  loading = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    
  ) {
    this.currentURL = window.location.origin;
  }

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.s = params['s'];
      this.searchData = [];
      this.pageNumber = 1;
      this.getSearchResults(this.s);
    });
  }
  showMore(tab: any, pg: any) {
    this.table = tab;
    this.pageNumber = parseInt(pg) + 1;
    this.getSearchResults(this.s, this.pageSize, this.pageNumber);
  }
  getSearchResults(s?: any, pageSize?: any, pageNumber?: any) {
    // this.loadMore = 0;
    // if (pageSize != undefined && pageNumber != undefined) {
    //   this.pageSize = pageSize;
    //   this.pageNumber = pageNumber;
    // }
    // this.searchService
    //   .loadSearchResults(this.s, this.pageSize, this.pageNumber, this.table)
    //   .subscribe({
    //     next: (res) => {
    //       if (this.table != '' && this.table != undefined) {
    //         this.setSearchData2(res);
    //       } else {
    //         this.setSearchData(res);
    //       }
    //     },
    //     error: (error) => {
    //       this.loading = false;
    //     },
    //     complete: () => {
    //       this.loading = false;
    //     },
    //   });
  }
  setSearchData2(res: any) {
    if (res.data) {
      this.searchData.forEach((val: any, key: any) => {
        if (val.name == this.table) {
          this.searchData[key].results = [
            ...this.searchData[key].results,
            ...res.data.res[0].results,
          ];
          this.searchData[key].totalCount = res.data.res[0].totalCount;
          this.searchData[key].perPageCount = res.data.res[0].perPageCount;
          this.searchData[key].pageNo = res.data.res[0].pageNo;
        }
      });
    }
    this.table = '';
  }

  setSearchData(res: any) {
    if (res.data) {
      this.searchData = [...this.searchData, ...res.data.res];
      this.totalRowsCount = res.data.totalCount;
      this.pageCnt += res.data.perPageCount;
      this.loadMore = 0;
      if (this.pageCnt < this.totalRowsCount) {
        this.loadMore = 1;
      }
    } else {
    }
    this.loading = false;
  }
}
