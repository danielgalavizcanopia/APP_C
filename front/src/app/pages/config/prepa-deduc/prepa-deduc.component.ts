import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-prepa-deduc',
  templateUrl: './prepa-deduc.component.html',
  styleUrls: ['./prepa-deduc.component.scss']
})
export class PrepaDeducComponent {

    products!: any[];
    visible!: boolean;

    showDialog() {
        this.visible = true;
    }

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService.getProductsSmall().then((data) => {
            this.products = data;
        });
    }
}
