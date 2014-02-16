KityMinder.registerModule( "TextEditModule", function () {
    var km = this;
    var sel = new Minder.Selection();
    var receiver = new Minder.Receiver(this);
    var range = new Minder.Range();

    this.receiver = receiver;

    var mouseDownStatus = false;

    var oneTime = 0;

    var lastEvtPosition,dir = 1;



    return {
        //插入光标
        "init":function(){
            this.getPaper().addShape(sel);
        },
        "events": {
            'beforemousedown':function(e){
                sel.setHide();
                var node = e.getTargetNode();
                if(node){
                    var textShape = node.getTextShape();
                    textShape.setStyle('cursor','default');
                    // 进入编辑模式条件：
                    // 1. 点击的节点是唯一选中的
                    // 2. 点击的区域是文字区域
                    if ( node.isSelected() ) {

                        sel.collapse();
                        node.getTextShape().setStyle('cursor','text');
                        receiver.setTextEditStatus(true)
                            .setSelection(sel)
                            .setKityMinder(this)
                            .setMinderNode(node)
                            .setTextShape(textShape)
                            .setBaseOffset()
                            .setContainerStyle()
                            .setSelectionHeight()
                            .setCurrentIndex(e.getPosition())
                            .updateSelection()
                            .setRange(range);
                        mouseDownStatus = true;
                        lastEvtPosition = e.getPosition();
                    }
                }
            },
            'mouseup':function(e){
                if(!sel.collapsed){
                    receiver.updateRange(range)
                }
                mouseDownStatus = false;
                oneTime = 0;
            },
            'beforemousemove':function(e){
                if(mouseDownStatus){
                    e.stopPropagationImmediately();
                    setTimeout(function(){

                        var offset = e.getPosition();
                        dir = offset.x > lastEvtPosition.x  ? 1 : (offset.x  < lastEvtPosition.x ? -1 : dir);
                        receiver.updateSelectionByMousePosition(offset,dir)
                            .updateSelectionShow(dir);
                        sel.stroke('none',0);
                        lastEvtPosition = e.getPosition();
                    },100)
                }


            },
            'restoreScene':function(){
                sel.setHide();
            },
            'stopTextEdit':function(){
                sel.setHide();

            }
        }
    };
} );