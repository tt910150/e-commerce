"""3-loyiha (azot kislotasi) uchun sxema, absorber chizmasi va grafik."""
import sys, json, os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon
sys.path.insert(0, os.path.dirname(__file__))
from figs import vessel, hx, comp, line, txt, catalyst, LW  # noqa: E402

OUT = sys.argv[1]


def scheme3():
    fig, ax = plt.subplots(figsize=(11, 6.6))
    ax.set_xlim(0, 22); ax.set_ylim(0, 13.2); ax.axis("off")
    # havo
    txt(ax, 0.1, 11.2, "Havo", fs=8)
    vessel(ax, 0.5, 9.6, 0.8, 1.2, num=1, r=0.1)
    line(ax, [(0.3, 11.1), (0.9, 11.1), (0.9, 10.8)])
    comp(ax, 2.3, 10.2, num=2)
    line(ax, [(1.3, 10.2), (1.95, 10.2)])
    # ammiak
    txt(ax, 0.1, 7.6, "Suyuq NH₃", fs=8)
    vessel(ax, 0.6, 5.8, 1.0, 1.4, num=3, r=0.3)
    line(ax, [(0.3, 7.5), (0.3, 6.5), (0.6, 6.5)])
    hx(ax, 2.6, 7.6, num=None); ax.text(2.6, 8.05, "4", ha="center", fontsize=10, weight="bold")
    line(ax, [(1.1, 7.2), (1.1, 7.6), (2.25, 7.6)])
    # 5 aralashtirgich
    vessel(ax, 4.0, 7.2, 0.9, 1.6, num=5, r=0.15)
    line(ax, [(2.95, 7.6), (4.0, 7.6)])
    line(ax, [(2.65, 10.2), (4.45, 10.2), (4.45, 8.8)])
    # 6 kontakt apparat + 7 qozon
    ax.add_patch(Polygon([[6.0, 10.4], [7.6, 10.4], [7.1, 11.4], [6.5, 11.4]], fc="white", ec="k", lw=LW))
    ax.add_patch(Rectangle((6.0, 6.0), 1.6, 4.4, fc="white", ec="k", lw=LW))
    for yy in [10.15, 10.05, 9.95]:
        ax.plot([6.05, 7.55], [yy, yy], color="tab:red", lw=1)
    ax.text(6.8, 10.7, "6", ha="center", fontsize=11, weight="bold")
    for yy in [6.4, 6.9, 7.4, 7.9, 8.4, 8.9]:
        ax.plot([6.15, 7.45], [yy, yy + 0.25], "k", lw=0.7)
    ax.text(6.8, 5.6, "7", ha="center", fontsize=11, weight="bold")
    line(ax, [(4.45, 8.8), (4.45, 11.8), (6.8, 11.8), (6.8, 11.4)])
    vessel(ax, 8.2, 9.8, 1.2, 0.6, r=0.25); ax.text(8.8, 10.1, "B", ha="center", va="center", fontsize=8)
    line(ax, [(7.6, 9.0), (8.8, 9.0), (8.8, 9.8)], arrow=False); line(ax, [(8.8, 10.4), (8.8, 11.2)]); txt(ax, 8.95, 11.0, "Bug‘ 1,6 MPa", fs=7)
    # 8 dum gaz isitgichi
    hx(ax, 9.4, 6.6); ax.text(9.4, 7.05, "8", ha="center", fontsize=10, weight="bold")
    line(ax, [(6.8, 6.0), (6.8, 5.2), (8.6, 5.2), (8.6, 6.6), (9.05, 6.6)])
    # 9 sovitgich-kondensator
    vessel(ax, 10.9, 3.2, 1.0, 3.6, num=9, r=0.3)
    line(ax, [(9.75, 6.6), (11.4, 6.6), (11.4, 6.8)], arrow=False)
    line(ax, [(11.4, 6.8), (11.4, 6.75)])
    line(ax, [(10.4, 4.0), (10.9, 4.0)], color="tab:blue"); txt(ax, 9.6, 3.7, "Sov. suv", fs=6.5, color="tab:blue")
    # 10 absorber
    ax.add_patch(Rectangle((13.6, 1.4), 1.6, 10.6, fc="white", ec="k", lw=LW))
    for yy in [2.0, 2.4, 2.8, 3.2]:
        ax.plot([13.6, 15.2], [yy, yy], "k", lw=0.6, ls=(0, (2, 1)))
    for yy in [i * 0.4 + 4.0 for i in range(19)]:
        ax.plot([13.6, 15.2], [yy, yy], "k", lw=0.6)
    ax.text(14.4, 12.25, "10", ha="center", fontsize=11, weight="bold")
    ax.text(15.35, 2.4, "11", fontsize=10, weight="bold")
    # gaz 9 -> absorber
    line(ax, [(11.4, 6.8), (11.4, 7.4), (13.0, 7.4), (13.0, 3.6), (13.6, 3.6)])
    # kondensat 9 -> absorber o'rtasi
    comp(ax, 12.4, 2.2, r=0.3, pump=True); ax.text(12.4, 1.6, "12", ha="center", fontsize=9, weight="bold")
    line(ax, [(11.4, 3.2), (11.4, 2.2), (12.1, 2.2)])
    line(ax, [(12.7, 2.2), (12.8, 2.2), (12.8, 1.0), (16.0, 1.0), (16.0, 6.4), (15.2, 6.4)])
    txt(ax, 15.7, 6.6, "40 % li kondensat", fs=6.5)
    # suv tepaga
    line(ax, [(17.0, 11.6), (15.2, 11.6)]); txt(ax, 16.0, 11.75, "Texnologik suv", fs=7)
    # ikkilamchi havo
    line(ax, [(2.3, 9.85), (2.3, 0.6), (13.2, 0.6), (13.2, 2.0), (13.6, 2.0)], color="0.35")
    txt(ax, 5.0, 0.75, "Ikkilamchi havo (oqartirish uchun)", fs=6.5, color="0.3")
    # mahsulot
    line(ax, [(14.4, 1.4), (14.4, 0.2), (17.5, 0.2)]); txt(ax, 15.6, 0.35, "HNO₃ 58 %, omborga", fs=7)
    # dum gaz
    line(ax, [(14.4, 12.0), (14.4, 12.8), (18.6, 12.8), (18.6, 9.4)], color="0.25")
    hx(ax, 18.6, 9.0); ax.text(19.1, 9.0, "13", fontsize=10, weight="bold", va="center")
    vessel(ax, 18.1, 5.4, 1.0, 2.4, r=0.2)
    catalyst(ax, 18.2, 6.0, 0.8, 1.0); ax.text(18.6, 7.3, "14", ha="center", fontsize=10, weight="bold")
    line(ax, [(18.6, 8.65), (18.6, 7.8)])
    comp(ax, 20.3, 4.4)
    line(ax, [(18.6, 5.4), (18.6, 4.4), (19.95, 4.4)])
    line(ax, [(20.65, 4.4), (21.5, 4.4), (21.5, 6.2)]); txt(ax, 20.6, 6.35, "Atmosferaga", fs=7)
    txt(ax, 19.3, 2.3, "15 – gaz turbinasi\n(2-kompressor bilan\numumiy valda)", fs=6.5)
    fig.tight_layout()
    fig.savefig(f"{OUT}/sxema3.png", dpi=170)


def absorber3():
    fig, ax = plt.subplots(figsize=(6.2, 9.4))
    ax.set_xlim(-4.2, 5.0); ax.set_ylim(-1.0, 15.0); ax.axis("off"); ax.set_aspect("equal")
    W = 2.2; x0 = -W / 2
    ax.add_patch(Rectangle((x0, 0.6), W, 13.2, fc="white", ec="k", lw=2))
    ax.add_patch(Polygon([[x0, 13.8], [x0 + W, 13.8], [0.4, 14.3], [-0.4, 14.3]], fc="white", ec="k", lw=2))
    ax.add_patch(Polygon([[x0, 0.6], [x0 + W, 0.6], [0.3, 0.1], [-0.3, 0.1]], fc="white", ec="k", lw=2))
    # oqartirish tarelkalari
    for yy in [1.4, 1.9, 2.4, 2.9]:
        ax.plot([x0, x0 + W - 0.3], [yy, yy], "k", lw=1.5, ls=(0, (3, 1)))
    # tarelkalar
    for i, yy in enumerate([3.8 + i * 0.6 for i in range(16)]):
        if i % 2 == 0:
            ax.plot([x0, x0 + W - 0.35], [yy, yy], "k", lw=1.5); ax.plot([x0 + W - 0.35, x0 + W - 0.35], [yy, yy - 0.35], "k", lw=1)
        else:
            ax.plot([x0 + 0.35, x0 + W], [yy, yy], "k", lw=1.5); ax.plot([x0 + 0.35, x0 + 0.35], [yy, yy - 0.35], "k", lw=1)
        if i < 12:
            for xx in [-0.7, -0.35, 0.0, 0.35, 0.7]:
                ax.add_patch(plt.Circle((xx, yy + 0.12), 0.07, fc="white", ec="tab:blue", lw=0.8))
    # shtutserlar va oqimlar
    ax.annotate("", xy=(0, 14.9), xytext=(0, 14.3), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.annotate("", xy=(0, -0.8), xytext=(0, 0.1), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.annotate("", xy=(x0, 13.2), xytext=(x0 - 1.4, 13.2), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.annotate("", xy=(x0, 3.3), xytext=(x0 - 1.4, 3.3), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.annotate("", xy=(x0, 0.9), xytext=(x0 - 1.4, 0.9), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.annotate("", xy=(x0 + W, 8.6), xytext=(x0 + W + 1.4, 8.6), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.annotate("", xy=(x0 - 0.0, 14.6), xytext=(x0 + W, 14.6), arrowprops=dict(arrowstyle="<->"))
    ax.text(-3.4, 14.5, "D = 1000 mm", fontsize=8.5)
    ax.annotate("", xy=(-1.9, 3.8), xytext=(-1.9, 12.8), arrowprops=dict(arrowstyle="<->")); ax.text(-2.75, 6.0, "45 tarelka, oralig‘i 0,6 m", fontsize=7.5, rotation=90)
    labels = [(14.9, "1 – dum gaz chiqishi"), (11.9, "2 – elaksimon tarelka"), (11.0, "3 – quyilish to‘sig‘i"), (10.0, "4 – sovituvchi zmeyeviklar"),
              (8.6, "5 – kondensat (40 %) kirishi"), (2.2, "6 – oqartirish tarelkalari"), (-0.6, "7 – HNO₃ (58 %) chiqishi")]
    for y, s in labels:
        ax.text(2.9, y, s, fontsize=7.3, va="center")
    ax.text(-4.2, 13.45, "8 – texnologik suv", fontsize=7.3)
    ax.text(-4.2, 3.5, "9 – nitroza gaz", fontsize=7.3)
    ax.text(-4.2, 1.1, "10 – ikkilamchi havo", fontsize=7.3)
    fig.tight_layout()
    fig.savefig(f"{OUT}/absorber3.png", dpi=170)


def chart3():
    d = json.load(open(f"{OUT}/prof3.json"))
    n = [r[0] for r in d["prof"]]; c = [r[1] for r in d["prof"]]; o = [r[2] for r in d["prof"]]
    fig, ax = plt.subplots(figsize=(6.4, 4.0))
    ax.semilogy(n, c, "k-", lw=1.8, label="NO (oksidlanmagan NOx), %")
    ax.semilogy(n, o, "k--", lw=1.4, label="O₂, %")
    ax.set_xlabel("Nazariy tarelkalar soni (erkin hajm / bitta tarelka hajmi)")
    ax.set_ylabel("Hajmiy ulush, %")
    ax.grid(True, which="both", lw=0.3, color="0.8")
    ax.legend(fontsize=8)
    fig.tight_layout()
    fig.savefig(f"{OUT}/chart3.png", dpi=170)


scheme3(); absorber3(); chart3()
