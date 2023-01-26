function scramble_image(e, t, a, n, d) {
  n || (n = !1),
    d || (d = !1),
    e.src.indexOf(".gif") > 0 || parseInt(t) < parseInt(a) || "1" == d
      ? "none" === e.style.display && (e.style.display = "block")
      : 1 == n || 0 == e.complete
      ? (document.getElementById(e.id).onload = function () {
          onImageLoaded(e);
        })
      : onImageLoaded(e);
}
function onImageLoaded(e) {
  var t;
  null == e.nextElementSibling
    ? ((t = document.createElement("canvas")), e.after(t))
    : (t = document.getElementById(e.id).nextElementSibling);
  var a = t.getContext("2d"),
    n = e.width,
    d = e.naturalWidth,
    i = e.naturalHeight;
  (t.width = d),
    (t.height = i),
    (n > e.parentNode.offsetWidth || 0 == n) && (n = e.parentNode.offsetWidth),
    (t.style.width = n + "px"),
    (t.style.display = "block");
  var r = document.getElementById(e.id).parentNode;
  r = (r = r.id.split("."))[0];
  for (var s = get_num(aid, r), l = parseInt(i % s), o = d, m = 0; m < s; m++) {
    var c = Math.floor(i / s),
      g = c * m,
      h = i - c * (m + 1) - l;
    0 == m ? (c += l) : (g += l), a.drawImage(e, 0, h, o, c, 0, g, o, c);
  }
  $(e).addClass("hide");
}
function showBig(e, t, a) {
  var n = document.getElementById("popup");
  if (
    ((n.onclick = function () {
      n.style.display = "none";
    }),
    t || (t = !1),
    t)
  ) {
    var d;
    0 != n.getElementsByTagName("img").length &&
      ((y = n.getElementsByTagName("img")[0]), n.removeChild(y)),
      0 == n.getElementsByTagName("canvas").length
        ? ((d = document.createElement("canvas")), n.append(d))
        : (d = n.getElementsByTagName("canvas")[0]);
    var i = d.getContext("2d"),
      r = e.naturalWidth,
      s = e.naturalHeight;
    (d.width = r),
      (d.height = s),
      window.screen.width < 991
        ? (d.style.width = window.screen.width + "px")
        : r > window.screen.width && (d.style.width = r / 2 + "px"),
      (d.style.padding = "10px");
    var l = a.split(".");
    l = l[0];
    for (var o = get_num(aid, l), m = parseInt(s % o), c = 0; c < o; c++) {
      var g = r,
        h = Math.floor(s / o),
        p = h * c,
        u = s - h * (c + 1) - m;
      0 == c ? (h += m) : (p += m), i.drawImage(e, 0, u, g, h, 0, p, g, h);
    }
  } else {
    var y;
    0 == n.getElementsByTagName("img").length
      ? ((y = document.createElement("img")), n.append(y))
      : (y = n.getElementsByTagName("img")[0]),
      (y.src = e);
  }
  n.style.display = "block";
}
function get_num(e, t) {
  var a = 10;
  if (e >= 268850) {
    var n = e + t;
    switch (((n = (n = (n = md5(n)).substr(-1)).charCodeAt()), (n %= 10))) {
      case 0:
        a = 2;
        break;
      case 1:
        a = 4;
        break;
      case 2:
        a = 6;
        break;
      case 3:
        a = 8;
        break;
      case 4:
        a = 10;
        break;
      case 5:
        a = 12;
        break;
      case 6:
        a = 14;
        break;
      case 7:
        a = 16;
        break;
      case 8:
        a = 18;
        break;
      case 9:
        a = 20;
    }
  }
  return a;
}
