"""4-loyiha (oddiy superfosfat) uchun sxema, kamera chizmasi va grafik."""
import sys, os, math
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon, Circle, Wedge
sys.path.insert(0, os.path.dirname(__file__))
from figs import vessel, hx, comp, line, txt, LW  # noqa: E402

OUT = sys.argv[1]


def bunker(ax, x, y, w, h, num):
    ax.add_patch(Polygon([[x, y + h], [x + w, y + h], [x + w, y + h * 0.35], [x + w * 0.6, y], [x + w * 0.4, y], [x, y + h * 0.35]], fc="white", ec="k", lw=LW))
    ax.text(x + w / 2, y + h * 0.6, str(num), ha="center", va="center", fontsize=11, weight="bold")


def scheme4():
    fig, ax = plt.subplots(figsize=(11, 6.4))
    ax.set_xlim(0, 22); ax.set_ylim(0, 12.8); ax.axis("off")
    txt(ax, 0.2, 12.2, "Fosforit (YuKFK)", fs=8)
    bunker(ax, 0.6, 9.4, 1.6, 2.4, 1)
    line(ax, [(1.0, 12.1), (1.4, 12.1), (1.4, 11.8)])
    # tarozili dozator 2
    ax.add_patch(Rectangle((0.8, 8.2), 2.4, 0.5, fc="white", ec="k", lw=LW)); ax.add_patch(Circle((0.95, 8.45), 0.2, fc="white", ec="k")); ax.add_patch(Circle((3.05, 8.45), 0.2, fc="white", ec="k"))
    ax.text(2.0, 7.85, "2", ha="center", fontsize=10, weight="bold")
    line(ax, [(1.4, 9.4), (1.4, 8.7)])
    # kislota
    txt(ax, 4.3, 12.2, "H₂SO₄ 93 %", fs=8)
    vessel(ax, 4.4, 9.6, 1.2, 1.9, num=3, r=0.2)
    line(ax, [(4.8, 12.1), (5.0, 12.1), (5.0, 11.5)])
    txt(ax, 6.6, 12.2, "Suv", fs=8)
    vessel(ax, 6.3, 9.6, 1.0, 1.4, num=4, r=0.2)
    line(ax, [(6.7, 12.1), (6.8, 12.1), (6.8, 11.0)])
    hx(ax, 8.6, 10.3); ax.text(8.6, 10.75, "5", ha="center", fontsize=10, weight="bold")
    line(ax, [(5.0, 9.6), (5.0, 9.2), (7.8, 9.2), (7.8, 10.3), (8.25, 10.3)])
    line(ax, [(6.8, 9.6), (6.8, 9.2)], arrow=False)
    txt(ax, 9.1, 11.0, "Sov. suv", fs=6.5, color="tab:blue")
    vessel(ax, 9.8, 8.8, 1.0, 1.4, num=6, r=0.2)
    line(ax, [(8.95, 10.3), (10.3, 10.3), (10.3, 10.2)])
    txt(ax, 9.2, 8.1, "H₂SO₄ 68 %, 338 K", fs=7)
    # aralashtirgich 7
    ax.add_patch(Rectangle((3.6, 6.4), 3.6, 1.0, fc="white", ec="k", lw=LW))
    for xx in [4.1, 4.7, 5.3, 5.9, 6.5]:
        ax.plot([xx - 0.2, xx + 0.2], [6.6, 7.2], "k", lw=1)
    ax.plot([3.7, 7.1], [6.9, 6.9], "k", lw=1.5)
    ax.text(5.4, 7.6, "7", ha="center", fontsize=11, weight="bold")
    line(ax, [(3.2, 8.45), (3.9, 8.45), (3.9, 7.4)])
    line(ax, [(10.3, 8.8), (10.3, 8.0), (6.9, 8.0), (6.9, 7.4)])
    # kamera 8
    ax.add_patch(Rectangle((8.0, 3.2), 5.0, 2.4, fc="white", ec="k", lw=LW))
    ax.add_patch(Rectangle((10.2, 3.2), 0.6, 2.4, fc="#eeeeee", ec="k", lw=1))
    ax.add_patch(Rectangle((8.1, 3.3), 2.05, 1.7, fc="#d9d9d9", ec="none", hatch=".."))
    ax.add_patch(Rectangle((10.85, 3.3), 2.05, 1.7, fc="#d9d9d9", ec="none", hatch=".."))
    ax.text(10.5, 5.85, "8", ha="center", fontsize=11, weight="bold")
    line(ax, [(7.2, 6.9), (8.6, 6.9), (8.6, 5.6)])
    ax.add_patch(Polygon([[11.6, 4.1], [12.6, 4.1], [12.4, 4.6], [11.8, 4.6]], fc="white", ec="k"))
    ax.text(12.1, 4.3, "9", ha="center", va="center", fontsize=9, weight="bold")
    # konveyer 10
    ax.add_patch(Rectangle((10.0, 1.6), 5.4, 0.4, fc="white", ec="k", lw=LW)); ax.add_patch(Circle((10.0, 1.8), 0.2, fc="white", ec="k")); ax.add_patch(Circle((15.4, 1.8), 0.2, fc="white", ec="k"))
    ax.text(12.7, 1.15, "10", ha="center", fontsize=10, weight="bold")
    line(ax, [(10.5, 3.2), (10.5, 2.0)])
    # ombor 11
    ax.add_patch(Polygon([[16.0, 0.6], [21.6, 0.6], [21.6, 3.0], [18.8, 4.4], [16.0, 3.0]], fc="white", ec="k", lw=LW))
    ax.add_patch(Polygon([[16.6, 0.6], [18.2, 0.6], [17.4, 1.9]], fc="#d9d9d9", ec="k"))
    ax.add_patch(Polygon([[18.6, 0.6], [20.4, 0.6], [19.5, 2.1]], fc="#d9d9d9", ec="k"))
    ax.text(18.8, 3.3, "11", ha="center", fontsize=11, weight="bold")
    line(ax, [(15.6, 1.8), (16.6, 1.8), (17.4, 2.1)])
    txt(ax, 19.0, 0.1, "Tayyor superfosfat (15 sutka)", fs=7)
    # ftor absorbsiyasi 12, 13
    line(ax, [(9.0, 5.6), (9.0, 6.2)], arrow=False)
    line(ax, [(12.0, 5.6), (12.0, 8.3), (14.0, 8.3)])
    vessel(ax, 14.0, 6.6, 1.3, 4.0, num=12, r=0.25)
    vessel(ax, 16.4, 6.6, 1.3, 4.0, num=13, r=0.25)
    line(ax, [(14.65, 10.6), (14.65, 11.2), (16.0, 11.2), (16.0, 7.2), (16.4, 7.2)])
    comp(ax, 19.2, 11.0, num=14)
    line(ax, [(17.05, 10.6), (17.05, 11.0), (18.85, 11.0)])
    line(ax, [(19.55, 11.0), (20.6, 11.0), (20.6, 12.4)]); txt(ax, 19.4, 12.3, "Atmosferaga", fs=7)
    line(ax, [(15.6, 12.0), (14.65, 12.0), (14.65, 11.5)], color="tab:blue", arrow=False)
    txt(ax, 15.6, 12.1, "Suv", fs=7, color="tab:blue")
    line(ax, [(14.65, 6.6), (14.65, 6.0), (15.8, 6.0)]); txt(ax, 15.0, 5.5, "H₂SiF₆ 8–10 %", fs=7)
    fig.tight_layout()
    fig.savefig(f"{OUT}/sxema4.png", dpi=170)


def chamber4():
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(9.6, 4.8), gridspec_kw={"width_ratios": [1.25, 1]})
    for a in (a1, a2):
        a.axis("off"); a.set_aspect("equal")
    # kesim
    a1.set_xlim(-3.2, 3.4); a1.set_ylim(-1.6, 3.4)
    D, d, H = 2.25, 1.0, 1.75
    a1.add_patch(Rectangle((-D - 0.1, 0), 0.1, H + 0.3, fc="#bbbbbb", ec="k"))
    a1.add_patch(Rectangle((D, 0), 0.1, H + 0.3, fc="#bbbbbb", ec="k"))
    a1.add_patch(Rectangle((-D - 0.1, -0.15), 2 * D + 0.2, 0.15, fc="#bbbbbb", ec="k"))
    a1.add_patch(Rectangle((-d / 2, 0), d, H + 0.3, fc="white", ec="k", lw=1.5))
    a1.add_patch(Rectangle((-D, 0), D - d / 2, H, fc="#d9d9d9", ec="none", hatch=".."))
    a1.add_patch(Rectangle((d / 2, 0), D - d / 2, H, fc="#d9d9d9", ec="none", hatch=".."))
    a1.add_patch(Rectangle((-D - 0.3, H + 0.3), 2 * D + 0.6, 0.15, fc="white", ec="k", lw=1.5))
    a1.add_patch(Rectangle((-1.6, H + 0.45), 0.3, 0.7, fc="white", ec="k"))
    a1.annotate("", xy=(-1.45, H + 0.15), xytext=(-1.45, H + 1.5), arrowprops=dict(arrowstyle="-|>", lw=1.3))
    a1.add_patch(Rectangle((0.9, H + 0.45), 0.35, 0.6, fc="white", ec="k"))
    a1.annotate("", xy=(1.07, H + 1.5), xytext=(1.07, H + 0.6), arrowprops=dict(arrowstyle="-|>", lw=1.3))
    for x in (-D + 0.3, D - 0.3):
        a1.add_patch(Circle((x, -0.35), 0.2, fc="white", ec="k"))
    a1.add_patch(Rectangle((-0.15, -0.9), 0.3, 0.75, fc="white", ec="k"))
    a1.annotate("", xy=(0, -1.5), xytext=(0, -0.6), arrowprops=dict(arrowstyle="-|>", lw=1.3))
    a1.annotate("", xy=(-D, 2.9), xytext=(D, 2.9), arrowprops=dict(arrowstyle="<->")); a1.text(-0.55, 2.98, "D = 900 mm", fontsize=8)
    a1.annotate("", xy=(2.75, 0), xytext=(2.75, H), arrowprops=dict(arrowstyle="<->")); a1.text(2.85, 0.55, "H = 0,7 m", fontsize=8, rotation=90)
    a1.text(-3.15, 3.25, "1 – pulpa quyish", fontsize=7.5)
    a1.text(0.2, 3.25, "2 – gaz chiqarish", fontsize=7.5)
    a1.text(-3.15, -1.15, "3 – tayanch roliklar", fontsize=7.5)
    a1.text(0.25, -1.4, "4 – superfosfat chiqishi", fontsize=7.5)
    a1.text(-0.45, 0.8, "5", fontsize=9, weight="bold")
    a1.text(-3.15, 1.0, "6", fontsize=9, weight="bold"); a1.plot([-2.95, -2.3], [1.05, 1.05], color="0.4", lw=0.6)
    a1.set_title("a) vertikal kesim", fontsize=9)
    # reja
    a2.set_xlim(-3.0, 3.0); a2.set_ylim(-3.0, 3.0)
    a2.add_patch(Circle((0, 0), 2.35, fc="#bbbbbb", ec="k"))
    a2.add_patch(Circle((0, 0), 2.25, fc="#d9d9d9", ec="k", hatch=".."))
    a2.add_patch(Circle((0, 0), 0.5, fc="white", ec="k", lw=1.5))
    a2.add_patch(Wedge((0, 0), 2.25, 75, 105, fc="white", ec="k"))
    a2.add_patch(Rectangle((0.5, -0.12), 1.75, 0.24, fc="white", ec="k", lw=1.2))
    for xx in [0.7, 1.0, 1.3, 1.6, 1.9]:
        a2.plot([xx, xx + 0.15], [-0.12, 0.12], "k", lw=0.8)
    a2.add_patch(Circle((0, 1.9), 0.18, fc="white", ec="k"))
    a2.annotate("", xy=(-1.6, 1.6), xytext=(-0.6, 2.2), arrowprops=dict(arrowstyle="-|>", connectionstyle="arc3,rad=0.3", lw=1.3))
    a2.text(-2.9, 2.6, "aylanish yo‘nalishi", fontsize=7.5)
    a2.text(0.6, 0.25, "frezer", fontsize=7.5)
    a2.text(0.25, 2.35, "pulpa", fontsize=7.5)
    a2.text(-0.45, -0.1, "d", fontsize=8)
    a2.set_title("b) reja (qopqoqsiz)", fontsize=9)
    fig.tight_layout()
    fig.savefig(f"{OUT}/kamera4.png", dpi=170)


def curing():
    days = [i * 0.25 for i in range(0, 121)]
    K = [0.92 - (0.92 - 0.82) * math.exp(-t / 5.0) for t in days]
    W = [13.6 + 26.2 * 0 + (14.5 - 7.5) * math.exp(-t / 6.0) for t in days]
    fig, ax = plt.subplots(figsize=(6.4, 3.8))
    ax.plot(days, K, "k-", lw=1.8, label="Parchalanish darajasi $K_p$")
    ax.set_xlabel("Yetiltirish vaqti, sutka"); ax.set_ylabel("$K_p$")
    ax.set_ylim(0.80, 0.94); ax.grid(True, lw=0.3, color="0.8")
    ax2 = ax.twinx()
    ax2.plot(days, [7.5 + 6.0 * math.exp(-t / 6.0) for t in days], "k--", lw=1.4, label="Namlik, %")
    ax2.set_ylabel("Namlik, %")
    h1, l1 = ax.get_legend_handles_labels(); h2, l2 = ax2.get_legend_handles_labels()
    ax.legend(h1 + h2, l1 + l2, fontsize=8, loc="center right")
    fig.tight_layout()
    fig.savefig(f"{OUT}/yetiltirish4.png", dpi=170)


scheme4(); chamber4(); curing()
