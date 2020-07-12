/***************************************************************************/
/*                                                                         */
/*  This obfuscated code was created by Javascript Obfuscator Free Version.*/
/*  Javascript Obfuscator Free Version can be downloaded here              */
/*  http://javascriptobfuscator.com                                        */
/*                                                                         */
/***************************************************************************/
eval(
  (function () {
    var k = [
      60,
      90,
      75,
      79,
      81,
      70,
      88,
      89,
      85,
      86,
      87,
      65,
      76,
      94,
      80,
      74,
      71,
      66,
      82,
      72,
    ];
    var x = [];
    for (var p = 0; p < k.length; p++) x[k[p]] = p + 1;
    var s = [];
    for (var b = 0; b < arguments.length; b++) {
      var j = arguments[b].split("~");
      for (var t = j.length - 1; t >= 0; t--) {
        var q = null;
        var u = j[t];
        var d = null;
        var a = 0;
        var l = u.length;
        var w;
        for (var v = 0; v < l; v++) {
          var r = u.charCodeAt(v);
          var n = x[r];
          if (n) {
            q = (n - 1) * 94 + u.charCodeAt(v + 1) - 32;
            w = v;
            v++;
          } else if (r == 96) {
            q =
              94 * (k.length - 32 + u.charCodeAt(v + 1)) +
              u.charCodeAt(v + 2) -
              32;
            w = v;
            v += 2;
          } else {
            continue;
          }
          if (d == null) d = [];
          if (w > a) d.push(u.substring(a, w));
          d.push(j[q + 1]);
          a = v + 1;
        }
        if (d != null) {
          if (a < l) d.push(u.substring(a));
          j[t] = d.join("");
        }
      }
      s.push(j[0]);
    }
    var z = s.join("");
    var h = "abcdefghijklmnopqrstuvwxyz";
    var m = [39, 92, 126, 10, 42, 96].concat(k);
    var c = String.fromCharCode(64);
    for (var p = 0; p < m.length; p++)
      z = z.split(c + h.charAt(p)).join(String.fromCharCode(m[p]));
    return z.split(c + "!").join(c);
  })(
    'var _$_7b13=["correct@yesult","gameStarted","operations","@ulus"," +<<ffeb31","Minus"," -<<d316d3","Nasobeni<? @e<<ffb400","Deleni<? /<<00a2ff","problemCount","start","prototype<8@yandom@uroblem","game@jver<8@yandomItem","random","scor<?undefined<8@ulus<8Minus<8Multiply<8Divid<?nam<?fill","color","text","num1","char","num2","@bn = ","res","integerIn@yang<?rnd"]<:<@Manager=(<2function <@Manager(){t<.0]]<*]]=false;t<.2]]=[<03[3<+4<)5]},<03[6<+7<)8]},<03[9<+10<)11]},<03[12<+13<)14]}]<*5]]}<,<!16]]=<2t<.15]]=0<*8]]()<*]]=true};<,<!19]]=<2t<.1]]=false};<,<!18]]=<2var i=@rldaEngine[<60]](t<.2]]);t<.0]]=<@[<61]]()@g0.5<:j=aldaEngine[<62]];if( typeof j===<63]){j=0}<:k;switch(i[<68]]){ca<33<\'4<4;ca<36<\'5<4;ca<39<\'6<4;ca<312<\'7<4};mathText[<69]]=i<50]];mathText<51]]=k<52]]+i<53]]+k<54]]+_$_7b13[35]+k<56]]<*5]]++};<,<!24]]<$1.5<14@ej+15<:n<-< <7o<-< <7p=<(?n+o:</< (n+<A0.75,(n+<A1.25<;!<#<=+<&<94<><"<%<,<!25]]<$1.35<13.6@ej+14<:n<-< <7o<-< m,l<;o>n){var q=o;o=n;n=q}<:p=<(?n-o:</< (n-<A0.75,(n-<A1.25<;p@g0){p= -p};if(!<#<=-<&<95<><"<%<,<!26]]<$0.01<10.2@ej+8<:n,o,p;do{n<-< m,l)}while(n===10);;do{o<-< m,l)}while(o===10);;if<({p=n@eo}else {if(<@[<61]]()@g0.5){p=n@e</< o-2,o+3<;p===0){<=}}else {p=o@e</< n-2,n+3<;p===0){p===o}}};if(!<#<=@e<&<96<><"<%<,<!27]]<$0.01<10.18@ej+7<:p<-< <7o<-< <7n=<(?p@eo:o@e</< p-2,p+3<;!<#n===p@e<&<97<><"<%return <@Manager})()~[38]]<57]](~_7b13[17]][_$_7b13[~};return {"num1":n,~t<.0]]&&(~=function(j){var m=~"num2":o,"res":p}};~o)){return this[_$_~]:k=t<.2~(t<.0]])~],color:_$_7b13[~;t<.1~],char:_$_7b13[~<@Manager[_$~=</~his[_$_7b13[~game[_$_7b13~{name:_$_7b1~@ej+2<:l=~function(){~se _$_7b13[~<>;break~[_$_7b13[3~_$_<9~m,l)<:~","get~7b13[2~;var ~);if(~ ","#~p===n~]](j)~e","~Math~o)@e'
  )
);
