class SyncHook{
  taps = []
  tap(name,fn) {//node events on  on
    this.taps.push(fn);
  }
  call() {//emit trigger
    this.taps.forEach(tap=>tap());
  }
}
let runHook = new SyncHook();
class RunPlugin{
  apply() {
    runHook.tap('1', () => {
      console.log('1');
    });
  }
}
let runPlugin = new RunPlugin();
runPlugin.apply();
runHook.call();



/* syncHook.tap(() => {
  console.log(1);
});
syncHook.tap(() => {
  console.log(2);
});

syncHook.call(); */