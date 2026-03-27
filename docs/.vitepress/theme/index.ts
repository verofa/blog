import DefaultTheme from "vitepress/theme-without-fonts";
import "./custom.css";
import PurpleTerminal from "./components/PurpleTerminal.vue";
import UnderConstruction from "./components/UnderConstruction.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("PurpleTerminal", PurpleTerminal);
    app.component("UnderConstruction", UnderConstruction);
  },
};
