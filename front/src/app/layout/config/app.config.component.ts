import { Component, Input, OnInit } from "@angular/core";
import { MenuService } from "../app.menu.service";
import {
    LayoutService,
} from "../../services/app.layout.service";
import { GLOBAL } from "src/config";

@Component({
    selector: "app-config",
    template: "",
})
export class AppConfigComponent implements OnInit {
    @Input() minimal: boolean = false;

    componentThemes: any[] = [];

    layoutThemes: any[] = [];

    scales: number[] = [12, 13, 14, 15, 16];

    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService
    ) {}

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config.scale;
    }

    set scale(_val: number) {
        this.layoutService.config.scale = _val;
    }

    get menuMode() {
        return this.layoutService.config.menuMode;
    }

    set menuMode(_val) {
        this.layoutService.config.menuMode = _val;
        if (
            this.layoutService.isSlimPlus() ||
            this.layoutService.isSlim() ||
            this.layoutService.isHorizontal()
        ) {
            this.menuService.reset();
        }
    }

    get colorScheme() {
        return this.layoutService.config.colorScheme;
    }

    set colorScheme(_val) {
        this.changeColorScheme(_val);
    }

    get ripple(): boolean {
        return this.layoutService.config.ripple;
    }

    set ripple(_val: boolean) {
        this.layoutService.config.ripple = _val;
    }

    ngOnInit() {
        this.componentThemes = [
            { name: "green", color: "#0BD18A" },
        ];
        this.applyScale()
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    changeColorScheme(colorScheme: any) {
        const themeLink = <HTMLLinkElement>(
            document.getElementById("theme-link")
        );
        const themeLinkHref = themeLink.getAttribute("href");
        const currentColorScheme =
            "theme-" + this.layoutService.config.colorScheme;
        const newColorScheme = "theme-" + GLOBAL.Schemecolor;
        const newHref = themeLinkHref!.replace(
            currentColorScheme,
            newColorScheme
        );
        this.replaceThemeLink(
            newHref,
            () => {
                this.layoutService.config.colorScheme = GLOBAL.Schemecolor;
                this.layoutService.onConfigUpdate();
            },
            "theme-link"
        );
    }

    changeTheme(theme: string) {
        const themeLink = <HTMLLinkElement>(
            document.getElementById("theme-link")
        );

        const newHref = themeLink
            .getAttribute("href")!
            .replace(this.layoutService.config.theme, GLOBAL.Theme);
        this.replaceThemeLink(
            newHref,
            () => {
                this.layoutService.config.theme = theme;
                this.layoutService.onConfigUpdate();
            },
            "theme-link"
        );
    }

    replaceThemeLink(href: string, onComplete: Function, linkId: string) {
        const id = linkId;
        const themeLink = <HTMLLinkElement>document.getElementById(id);
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);                                

        cloneLinkElement.setAttribute("href", href);
        cloneLinkElement.setAttribute("id", id + "-clone");

        themeLink.parentNode!.insertBefore(
            cloneLinkElement,
            themeLink.nextSibling
        );

        cloneLinkElement.addEventListener("load", () => {
            themeLink.remove();
            cloneLinkElement.setAttribute("id", id);
            onComplete();
        });
    }

    decrementScale() {
        this.scale--;
        this.applyScale();
    }

    incrementScale() {
        this.scale++;
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = GLOBAL.scales + "px";
    }
}
