(function () {
    angular
        .module("utility",[])
        .directive("sortable",sortable)
        .directive("ifrm",ifrm);

    function ifrm() {
        console.log("I am here");
        function linker1(scope, element, attributes) {
            console.log("inside linker");
            $("#search").click(function () {
                element.context.innerHTML = '<div ifrm id="tabs2"> <iframe id = "ifrm" width="640"height="390"frameborder="0" title="YouTube video player"type="text/html"src="http://www.youtube.com/embed/ylLzyHk54Z0?enablejsapi=1"></iframe></div>';

            });
        }
        return {
            scope:{},
            link:linker1,
            controller : sortController,
            controllerAs : 'sortController'
        }
        function sortController() {

        }
    }
    function sortable() {
        function linker(scope, element, attributes) {
            var start =-1;
            var end  = -1;
            element.sortable({
                start:function (event,ui) {
                    start = $(ui.item).index();
                },
                stop: function (event, ui) {
                    end = $(ui.item).index();
                    var elem = element.context.baseURI.split("/");
                    var pid;
                    for(w in elem){
                        if(elem[w]=="page"){
                            pid = elem[Number.parseInt(w)+1];
                        }
                    }
                    console.log([start,end]);
                    scope.sortController.sort(start,end,pid);
                }
            });
        }

        return {
            scope:{},
            link:linker,
            controller : sortController,
            controllerAs : 'sortController'
        }
        function sortController() {

        }
    }
})();