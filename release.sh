npm install
ng build ng-gxscrollable --prod
ng build --prod --base-href=/ng-gxscrollable/demo/
rm -rf ./demo && mv dist/ng-gxscrollable-demo ./demo
