/**
 * mykit-chat实时聊天系统H5 SDK
 * Created by binghe
 */
var socket = null;
var isAuth = false;
var connectionName = null;
var connectionCount = 0;
var web_socket_url = "ws://localhost:8099/websocket";
$(function () {
    $("#menuModal").modal('show');
    var height = $(window).height();
    $('#content').css("height", height - $('#top').height() - $('#opt').height() - 40);

    $('#loginBtn').click(function(){
        connectionAuth();
    });

    $('#faceBtn').qqFace({
        id: 'facebox',
        assign: 'message',
        path: 'arclist/'	//表情存放的路径
    });

    $('#sendBtn').click(function () {
        var message = $("#message").val().trim();
        if(message){
            sendMessage(message);
            $("#message").val('');
        }
    }).keyup(function(e){
        var keyCode = e.which || e.keyCode;
        if(keyCode==13){
            $("#sendBtn").click();
        }
    });
});

function sendMessage(message) {
    send(true, "{'code':10086,'message':'"+message+"'}");
}


function connectionAuth() {
    if (!connectionName) {
        connectionName = $('#connectionName').val().trim();
    }
    if (connectionName) {
        if (!window.WebSocket) {
            window.WebSocket = window.MozWebSocket;
        }
        if (window.WebSocket) {
            window.socket = new WebSocket(web_socket_url);
            window.socket.onmessage = function (event) {
                var data = eval("(" + event.data + ")");
                console.log("onmessage data: " + JSON.stringify(data));
                switch (data.uri) {
                    case 1 << 8 | 220: // ping message
                    case 2 << 8 | 220: // pong message
                        console.log("ping message: " + JSON.stringify(data));
                        pingInvake(data);
                        break;
                    case 3 << 8 | 220: // system message
                        console.log("system message: " + JSON.stringify(data));
                        sysInvake(data);
                        break;
                    case 4 << 8 | 220: // error message
                        console.log("error message: " + JSON.stringify(data));
                        closeInvake(null);
                        break;
                    case 5 << 8 | 220: // auth message
                        console.log("auth message: " + JSON.stringify(data));
                        break;
                    case 6 << 8 | 220: // broadcast message
                        console.log("broadcast message: " + JSON.stringify(data));
                        broadcastInvake(data);
                        break;

                }
            };
            window.socket.onclose = function (event) {
                console.log("connection close!!!");
                closeInvake(event);
            };
            window.socket.onopen = function (event) {
                console.log("connection success!!");
                openInvake(event);
            };
        } else {
            alert("您的浏览器不支持WebSocket！！！");
        }
    } else {
        $('#tipMsg').text("请输入昵称");
        $('#tipModal').modal('show');
    }
}

function send(auth, message) {
    if (!window.socket) {
        return;
    }
    if (socket.readyState == WebSocket.OPEN || auth) {
        console.log("send: " + message);
        window.socket.send(message);
    } else {
        $('#tipMsg').text("连接没有成功，请重新登录");
        $('#tipModal').modal('show');
    }
}
;

function openInvake(event) {
    var obj = {};
    obj.code = 10000;
    obj.conn_name = $('#connectionName').val().trim();
    send(true, JSON.stringify(obj));
}
;


function closeInvake(event) {
    window.socket = null;
    window.isAuth = false;
    window.connectionCount = 0;
    $('#tipMsg').text("登录失败，网络连接异常");
    $('#tipModal').modal('show');
}
;

/**
 * 处理系统消息
 * @param data
 */
function sysInvake(data) {
    switch (data.extend.code) {
        case 20001: // connection count
            console.log("current connection: " + data.extend.message);
            connectionCount = data.extend.message;
            $('#connectionCount').text(connectionCount);
            break;
        case 20002: // auth
            console.log("auth result: " + data.extend.message);
            isAuth = data.extend.message;
            if (isAuth) {
                $("#menuModal").modal('hide');
                $('#chatWin').show();
                $('#content').append('欢迎使用mykit-chat实时聊天系统！！');
                // $('#content').scrollTop($('#content')[0].scrollHeight);
            }
            break;
        case 20003: // system message
            console.log("system message: " + data.extend.message);
            break;
    }
}
;

/**
 * 处理广播消息
 * @param data
 */
function broadcastInvake(data) {
    var message = data.body;
    var connectionName = data.extend.conn_name;
    var uid = data.extend.conn_id;
    var time = data.extend.current_time;
    message = replace_em(message);
    var html = '<div class="title">'+connectionName+'&nbsp;('+uid+') &nbsp;'+time+'</div><div class="item">'+message+'</div>';
    $("#content").append(html);
    $('#content').scrollTop($('#content')[0].scrollHeight);

}
;

function erorInvake(data) {

}
;

/**
 * 处理ping消息
 * @param data
 */
function pingInvake(data) {
    //发送pong消息响应
    send(isAuth, "{'code':10016}");
}
;
//查看结果
function replace_em(str) {
    str = str.replace(/\</g, '&lt;');
    str = str.replace(/\>/g, '&gt;');
    str = str.replace(/\n/g, '<br/>');
    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="arclist/$1.gif" border="0" />');
    return str;
};
