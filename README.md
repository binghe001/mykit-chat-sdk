# 作者简介: 
冰河，高级软件架构师，Java编程专家，Spring、MySQL内核专家，Mykit系列开源框架创始人、首席架构师及开发者，Android开源消息组件Android-MQ独立作者，国内知名开源分布式数据库中间件Mycat核心架构师、开发者，精通Java, C, C++, Python, Hadoop大数据生态体系，熟悉MySQL、Redis内核，Android底层架构。多年来致力于分布式系统架构、微服务、分布式数据库、大数据技术的研究，曾主导过众多分布式系统、微服务及大数据项目的架构设计、研发和实施落地。在高并发、高可用、高可扩展性、高可维护性和大数据等领域拥有丰富的经验。对Hadoop、Spark、Storm等大数据框架源码进行过深度分析并具有丰富的实战经验，《海量数据处理与大数据技术实战》作者。

# 作者联系方式
QQ：2711098650

# 项目简述
mykit-chat-sdk是mykit-chat实时聊天系统的客户端SDK，目前实现的功能如下：  
1. 支持昵称登录；  
2. 支持多人同时在线；  
3. 同步显示在线人数；  
4. 支持文字和表情的内容；  
5. 浏览器与服务器保持长连接，定时心跳检测；  

# 项目实现逻辑
*  mykit-chat-sdk-h5模块是mykit-chat实时聊天系统的H5客户端SDK，通过WebSocket协议接入，与mykit-chat服务端进行通信，所以，浏览器必须支持WebSocket协议
* mykit-chat-sdk-java模块是mykit-chat实时聊天系统的Java客户端SDK，目前未实现

# 项目协议

协议比较简单，所有的消息都一个Json字符串，格式如下：  
`head | body | extend`  

* head作为头部，用int类型存储，4个字节；
* body 消息的有效载体，用string类型存储，长度无限度；
* extend 协议的扩展字段，用map类型存储；
  

# 项目结构说明
* mykit-chat-sdk-h5：mykit-chat实时聊天系统的H5客户端SDK

# 项目发布
* 运行mykit-chat实时聊天系统的H5客户端SDK时，直接拷贝mykit-chat-sdk-h5文件夹下的所有文件和目录到Tomcat或者其他Web服务器下运行。

# 注意事项
1. 当启动mykit-chat项目时未动态指定主机名（IP地址）和端口时  
mykit-chat-sdk-h5/resources/js/mykit_chat.js文件中配置的WebSocket链接地址必须和mykit-chat[https://github.com/sunshinelyz/mykit-chat]项目的
mykit-chat-config模块下的src/main/resources目录下的websocket.properties文件中配置的WebSocket链接地址一致。如下所示：  
*  mykit_chat.js文件中配置的WebSocket链接地址如下：  
```var web_socket_url = "ws://localhost:8099/websocket";```  
*  websocket.properties文件中配置的WebSocket链接地址如下：  
```websocket_url=ws://localhost:8099/websocket```
2. 当启动mykit-chat项目时动态指定了主机名（IP地址）和端口时  
mykit-chat-sdk-h5/resources/js/mykit_chat.js文件中配置的WebSocket链接地址中的主机名（IP地址）和端口必须和启动mykit-chat项目时动态指定的主机名（IP地址）和端口一致