import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'dash-financial',
  templateUrl: './dash-financial.component.html',
  styleUrls: ['./dash-financial.component.scss']
})
export class DashFinancialComponent {

  items!: MenuItem[];
  products!: any[];
  visible!: boolean;

     showDialog() {
        this.visible = true;
    }

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProductsSmall().then((data) => {
      this.products = data;
    });

    this.items = [
      {
        label: 'View History',
        routerLink: ''
      }
    ]
  }

}
