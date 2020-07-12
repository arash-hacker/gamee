/***************************************************************************/
/*                                                                         */
/*  This obfuscated code was created by Javascript Obfuscator Free Version.*/
/*  Javascript Obfuscator Free Version can be downloaded here              */
/*  http://javascriptobfuscator.com                                        */
/*                                                                         */
/***************************************************************************/
eval(
  (function () {
    var e = [
      88,
      66,
      85,
      65,
      70,
      76,
      72,
      82,
      87,
      79,
      81,
      89,
      90,
      75,
      71,
      80,
      74,
      94,
      86,
      60,
    ];
    var q = [];
    for (var u = 0; u < e.length; u++) q[e[u]] = u + 1;
    var y = [];
    for (var j = 0; j < arguments.length; j++) {
      var o = arguments[j].split("~");
      for (var s = o.length - 1; s >= 0; s--) {
        var i = null;
        var a = o[s];
        var f = null;
        var k = 0;
        var n = a.length;
        var p;
        for (var m = 0; m < n; m++) {
          var z = a.charCodeAt(m);
          var b = q[z];
          if (b) {
            i = (b - 1) * 94 + a.charCodeAt(m + 1) - 32;
            p = m;
            m++;
          } else if (z == 96) {
            i =
              94 * (e.length - 32 + a.charCodeAt(m + 1)) +
              a.charCodeAt(m + 2) -
              32;
            p = m;
            m += 2;
          } else {
            continue;
          }
          if (f == null) f = [];
          if (p > k) f.push(a.substring(k, p));
          f.push(o[i + 1]);
          k = m + 1;
        }
        if (f != null) {
          if (k < n) f.push(a.substring(k));
          o[s] = f.join("");
        }
      }
      y.push(o[0]);
    }
    var h = y.join("");
    var x = "abcdefghijklmnopqrstuvwxyz";
    var g = [96, 10, 42, 126, 92, 39].concat(e);
    var w = String.fromCharCode(64);
    for (var u = 0; u < g.length; u++)
      h = h.split(w + x.charAt(u)).join(String.fromCharCode(g[u]));
    return h.split(w + "!").join(w);
  })(
    'var _$_f101=["antialias","clear@hefore@nendXvscaleModB&scalB&@iSE@n_SC@j@lE","ScaleManagXvpage@jlign@morizontally","page@jlign@yertically","@hasic","X\\01","gfx/X[@har/X\\01XcimagB&loaB\'X\\02","gfx/X[@har/X\\02XcX\\logo","gfx/X[@har/X\\logoXcX[StaX{adB\'staX{sB*","XPColor","stage"Xn","#fff","width","setTo","anchor","x","spriX{set@vreB.SpriX{XuB&ikona_dobreX!dobreX>zleX!zleXcXP",X)XPX>okX!okX>xX!xXIhraX1hraXcjojo-netX]hannery/jojo-netXcsplashX]hannery/splashXcspritesheeB/crossX]hannery/x-crossX>playX!playX>plusX!plusX>minusX!minusX>nX`X!nX`X>delB;X!delB;XIplayX1playXIplusX1plusXIminusX1minusXInX`X1nX`XIdelB;X1delB;XcXP_empty",X)B0 war_bgXclogo",X)logoXcpXJempty",X)B<@oar_pXJ01XcpXJfull",X)B<@oar_pXJ02XcmainMXishowMXimenuManagXvandroiB\'devicB&i@pS","B9jCE@h@j@B)B6boarB\'addB6","keyboarB\'inputXsDowB)now","InMXiTwo@hB7ns","requestControllXvcontrollXvkeydownXs","righB/bB7ns","left"Xn@B.eB\'bB7B)undefineB\'inputEnB8B\'pixel@verfect@pvXvuse@mandCursor","y","NonB&@linear","Easing","to","tweenXsInputDowB)events","group","fixedToCamera","addMXicenter@g","worlB\'center@r"XnMXiB6CodB&heighB/opeB)@nectanglB&crop"," ","maaxblack","72px","bolB\'centXvtexB/36px","whiX{@lE@kT","@nI@u@mT","","40px"XnEndedMXiScore: ","Xz","@hest Xz: ","maxScore"XnsCounB/show@vop@ip@oXy","wXySizB&miB)set@iserScalB&set@nesizeCallbackXsfocusXsblurXsMuteXs@inmuteXs@vauseXs@nesumeXs@nesB*","InXu","DeadXsStop"];X_ init(){XA[0XYXA[1]]=falseXX_X02]]=X65XD4]]XX_X06XYgXh_X07XYinitCallbacks()}X_ preB.(){ifX\'X"fB-8]]Xb$_X$X=9XL10XEX$X=13XL14XEX$X=15XL16])}X8(){XA[19]]X;XV17],X[State);XA[19XD20XG17])}var X[State={preB.:XHifX\'X"fB-8]]){tXS1[23XD22XD21]]=XV24]Xw@h=BA[_$X XtXA[Xg,24XN15]);@hXFX.Xm@hXTBB-=@hXTXgXwz=BA[_$X XtXA[Xg,48XN9]);zXFX.XmzXTBB-=zXTXgXw@j=BA[_$X 29]](XA[Xg,48XN13]);@jXFX.Xm@jXTBB-=@jXTXg;BAB4X$30]B@,0)};ifX\'X"fX^Xb$_X$X=32XL33XEX$X=34XL35XEX$X=36XL37])}else {gXh_X$X=38XL39XEX$X=40XL41XEX$X=42XL43XEX$X=44XL45XEX$48XG46XL47],336,280XZ$_X$X=49XL50])}XX_X$X=51XL52XEX$X=53XL54XEX$X=55XL56XEX$X=57XL58XEX$X=59XL60XEX$X=61XL62XEX$X=63XL64XEX$X=65XL66XEX$X=67XL68XEX$X=69XL70XEX$X=71XL72XEX$X=73XL74XEX$X=75XL76XEX$X=77XL78])},Xf:XHB0Manager= new B<Manager();XfMainXl;XfXuXlB(@h@iI@lD_T@r@vE!=X"fX^){XfEndedXl};aX%81XD80XG79])B(!XA[83XD82]]&&!XA[83XD84]]XeD=XAX?[88XD87]](X686XD85B1DXT90]]X;checkXuSB*Xo};setInterval(time@ipB=,20);B.Time=DateXT91B,;XR@X:01[92]];ifX\'X"fX^XeC=gameeXT95XD94XG93],{enB8B6board:B );CXT99XD98XD97XG96]XK1);CXT99XD100XD97XG96]XK2)};aX%101B,}};X_ Xf@hasicXac,X}E,bXe@nXWX 102]](X}c,EXo;@nXFX.XUX;@n);return @nX8Xa@i,@y,X}E,b,@o,@g,T){if( typeof @o===XV103]){@o=0}B( typeof @g===XV103]){@g=0}Xw@nB(E===null){@nXWX XtX}@i)}else {@nXWX 29]](X}@i);XO[104XYXOX?[105XYXOX?[106]]=B ;@nXFX.XUX;@n)XwSXWX XtXO[BB+@o,XO[107]]+@g,@y);SXFX.XUX;S)B(E!==null){XO[114XD113]]X;XH@nB4X0XQSB4X0XQgXhX XkXO[X7X2X([XB1[1X9X*XXX XkSXTX7X2X([XB1[1X9X*;E()}Xo}B( typeof T!==XV103]Xeg=XAX?[88XD87]](T);gXT90]]X;XH@nB4X0XQSB4X0XQgXhX XkXO[X7X2X([XB1[1X9X*XXX XkSXTX7X2X([XB1[1X9X*;E()}Xo};return {"bB7n":@n,"innerImage":S}X8MainMenu(XebhXWX 115B,;bhXM16XYifX\'X"fX^Xb$X XdXN36X|h);aX%81XD117XG79],bh);return}XXX XdXN71X|hXZ$X XtX/X53XN73X|h)XFX..5,0)Xjg=110Xje=X/]XMB5Xjf=X/]XM20]]+50;X&Xx1XL51B2,bf,XHif(XR==@X:01[92]]){aX%81XD80XG121])}},bh,8,-12,X6122XD85B1X&Xx7XL57B2-bBC-X-X&Xx9XL59B2+bBC-X-X&Xx5XL55B2-bBC+X-X&Xx3XL53B2+bBC+X-if(DIB9l@j@r_@jDXe@s=Xf@hasicXaXV44],X/X5XA[123]]-5X@wXyXM24]B@D_@i@n@lB>h);@sXT3X..65,0.65XZ$X Xk@sXTX7]]({xB#,yB#},7X([XB1[1X98]]B%B$B%)};aX%81XD117XG79],bh)X8XuMenu(XebcXWX 115B,Xjd=X\'X"fX^&&XA[83XD84]])?80:0XXX Xt0,bd,XV71XpXZ$X Xt0,bd,XV75Xp);XCXWX Xt0,bd,XV77Xp);XC@nect= new X6125]](0,0,0,XCXM23B1XCXM26]](XC@nect);B0B+XWX XqX/X5X\'X"fB-8]])?260:32XN127],X4X,Xr29],"font@oeight":XV130B!X3});B0B+XFX..5XmbcX;B0B+);switch(@h@iI@lD_T@r@vE){case ImplementationXT8]]:XzB+XWX XqX/X51XN127],X4X,Xr33B!X3,"stroke":XV134],"strokeThickness":3});XzB+XFX..5,0);bcX;XzB+);X&B-42XL40],X/]XMB5-B?520XK2,bcB$2,X6122XD135B1X&B-42XL38],X/]XMB5+B?520XK1,bcB$2,X6122XD136B1break;case ImplementationXT31]]:gXhX XtX/]XMB5-B?XAB"XL34Xp)XFX..5,1XZ$X XtX/]XMB5+B?XAB"XL32Xp)XFX..5,1);break};aX%81XD117XG121],bc,sB*Xu)X8EndedMenu(XebbXWX 115B,;bbXM16XYgXhX XdXN71X|bXZ$X XtX/X53XN73X|b)XFX..5,0)Xw@rXWX XqX/X520XN137],X4X,Xr38B!X3,"fill":XV134]});@rXFX..5XmbbX;@r)XjaXWX XqX/X526XN137],X4X,Xr38B!X3,"fill":XV134]});baXFX..5XmbbX;ba);X&Xx1XL51],X/X542X@aX%81XD80XG121]B>b,8,-12)B(DIB9l@j@r_@jDXe@s=Xf@hasicXaXV44],X/X5XA[123]]-5X@wXyXM24]B@D_@i@n@lB>b);@sXT3X..65,0.65XZ$X Xk@sXTX7]]({xB#,yB#},7X([XB1[1X98]]B%B$B%)};aX%81XD117XG139],bb,XH@rXM32]]=XV140]+aX%141]];baXM32]]=XV142]+aX%143]]B(DIB9l@j@r_@jD&&aX%144]]%2===0){aX%145XG46],320,32X@wXyXM24]B@D_@i@n@lB>b)}})}X_ initCallbacks(Xb$_X0149]](X_(bj,bi){bi=@jX%146]]Xjk=B<XM47]](biXT25]],biXM23]])/640;bjXM48]](bk,bk,0,0)}Xo;tXSB30X<canSB*Xu=B ;tXSB31]]=tXSB30]];aX%152X<audioEnB8d=false};aX%153X<audioEnB8d=B ;aX%154X<upB=@vaused=B ;aX%155X<upB=@vaused=false;last@ipB==DateXT91B,};aX%156X<if(XR==@X:0B37]]||XR==@X:0B38]]){sB*Xu()}};aX%159X<}}~_f101[18XD~","gfx/Icons/ikona_~=ImplementationB4~X\'=~f101[12XD~ldaEngineXT~createXa_$_f~(@h@iI@lD_T@r@vE==~50,@vhaserB4f101~"gfx/@hackgrounds/~8]]B%,0,0B%)~X25~28],"fontSize":_$_~bg,null,bhB$2);~XD26]](0~XA[119]~f101[3XD~","gfx/Icons/btn_~]]({x:1.1,y:1.1},~ign":XV131]~{"font":XV1~]XM18]],~@vhaserXT~3]])XM11~}X_ create~09XD10~uameStateB4f1~XM8]](~]]=XH~11XG~Xcikona_~[89]]B4f101~0,XH~gXh_f101~110]]B4f10~progress@har~]]XT~])XX_~XT27~]](XV~X_(){~Xcbtn_~rogressbar_~,bB7nDown~],XV~XT1~0,XV~@nB4f101~background~26]](1,1);~gameState=~hisB4f10~[XV~.5Xmb~_$_fB-~=gXh~;gXh~]]=true;~);game[_~@B.ing~B.ing_~","gfx/@~B-31]]~function~asobB;~@hB7n(~){game[_~.png","~Xt0,~){var ~create~25]]/2~ame[_$~enu","~Xwb~112]](~Menu()~,0.5);~,"game~,BA)~X|c~132]](~fB-1~","on~11]](~@uame~er","~;var ~B-6~indow~score~tB&~],0,b~@l,N,~true}~],"al~[123]~:0.75~,0,-1~,true~e","~d","~;if(~n","~tart~Text~]]()~101[~load~t","~math~]]);~],be~1[15~[_$_~18]]~@tey~utto~able~S@v@~dele~enie~Math~date~)},b~150,~](@j~this~28]]~g,bf'
  )
);
