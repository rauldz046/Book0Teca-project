import { Component, OnInit } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  image:string;
  inventoryStatus: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {

  urlPlaceHolder:string = 'https://stephenblandino.com/wp-content/uploads/2015/07/book-placeholder.jpg'
  
  products: Product[] = [];
  
  responsiveOptions: any[] = [];
  
 ngOnInit() {
    this.products = [
      { id: 1, name: 'Produto 1', price: 29.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 2, name: 'Produto 2', price: 49.99, image: this.urlPlaceHolder, inventoryStatus: 'LOWSTOCK' },
      { id: 3, name: 'Produto 3', price: 19.99, image: this.urlPlaceHolder, inventoryStatus: 'OUTOFSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 5, name: 'Produto 5', price: 59.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
      { id: 4, name: 'Produto 4', price: 99.99, image: this.urlPlaceHolder, inventoryStatus: 'INSTOCK' },
    ];

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }
  

}
