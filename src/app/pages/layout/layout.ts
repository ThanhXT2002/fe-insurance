import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { TopHeader } from "../../components/header/top-header/top-header";


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Footer, TopHeader],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

}
