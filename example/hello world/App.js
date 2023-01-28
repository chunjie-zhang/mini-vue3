export const App = {
  render() {
    return h('div', 'hi, '+ this.msg +'mini-vue');
  },
  setup(props) {
    return {
      msg: 'zcj'
    };
  }
};