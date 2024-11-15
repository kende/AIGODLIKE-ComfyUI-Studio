import Head from "../../components/home/head/index.js";
import Classification from "../../components/home/classification/index.js";
import Model from "../../components/home/model/index.js";
import Foot from "../../components/home/foot/index.js";

export default {
  name: "Home",
  components: {
    Head,
    Classification,
    Model,
    Foot,
  },
  data() {
    return {
      allList: [],
      searchParameter: {
        key: "",
        sort: "",
        level: "",
        tags: [],
      },
      isLoading: true,
      column: 0,
      columnIndex: 0,
    };
  },
  computed: {
    selectedWidget() {
      return this.node?.CSgetSelModelWidget();
    },
    rendering() {
      return this.renderer?.rendering;
    },
  },
  watch: {
    nodeId: {
      handler() {
        this.allList = this.node?.CSgetModelLists() || [];
      },
      immediate: true,
    },
  },
  mounted() {
    const language = localStorage.getItem("language") || "en";
    this.columnIndex = JSON.parse(localStorage.getItem("columnIndex"));
    if (typeof this.columnIndex !== "number") {
      this.columnIndex = 3;
    }
    this.column = this.$t("home.head.sizeList")[this.columnIndex].value;
    this.$i18n.locale = language;
    this.$store.commit("config/updateLanguage", language);
    this.isLoading = false;
  },
  methods: {
    // Change the quantity displayed in a row
    changeColumn(value) {
      this.column = value;
    },
    // Change filtering criteria
    changeSearchParameter(value) {
      this.searchParameter = {
        ...this.searchParameter,
        ...value,
      };
    },
  },
  template: `<div v-if="!isLoading" class="home_page">
               <div class="content">
                <Head :column-index="columnIndex" @changeSearchParameter="changeSearchParameter" @changeColumn="changeColumn" :all-list="allList" />
                <Classification @changeSearchParameter="changeSearchParameter" :all-list="allList" />
                <Model :column="column" :all-list="allList" :selected-widget="selectedWidget" :search-parameter="searchParameter" />
              </div>
              <Foot :all-list="allList" v-show="rendering"/>
             </div>`,
};
