"""5-loyiha (oltingugurtdan sulfat kislota) uchun sxema, absorber chizmasi va x–T diagramma."""
import sys, os, json
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon, Circle, FancyBboxPatch
sys.path.insert(0, os.path.dirname(__file__))
from figs import vessel, hx, comp, line, txt, catalyst, LW  # noqa: E402

OUT = sys.argv[1]


def scheme5():
    fig, ax = plt.subplots(figsize=(11, 6.6))
    ax.set_xlim(0, 22); ax.set_ylim(0, 13.2); ax.axis("off")
    # havo -> quritish minorasi 1 -> kompressor 2
    txt(ax, 0.1, 2.0, "Havo", fs=8)
    vessel(ax, 0.6, 2.6, 1.2, 4.4, num=1, r=0.2)
    line(ax, [(0.2, 1.8), (0.4, 1.8), (0.4, 3.0), (0.6, 3.0)])
    comp(ax, 2.9, 8.0, num=2)
    line(ax, [(1.2, 7.0), (1.2, 8.0), (2.55, 8.0)])
    # oltingugurt
    txt(ax, 0.1, 12.3, "Suyuq S (413 K)", fs=8)
    vessel(ax, 0.6, 10.0, 1.4, 1.6, num=3, r=0.3)
    line(ax, [(0.4, 12.2), (1.3, 12.2), (1.3, 11.6)])
    comp(ax, 3.0, 10.4, r=0.3, pump=True); ax.text(3.0, 9.85, "4", ha="center", fontsize=9, weight="bold")
    line(ax, [(2.0, 10.4), (2.7, 10.4)])
    # o'choq 5
    ax.add_patch(FancyBboxPatch((4.2, 9.4), 3.4, 1.6, boxstyle="round,pad=0,rounding_size=0.7", fc="#fbe3d0", ec="k", lw=LW))
    ax.text(5.9, 10.2, "5", ha="center", va="center", fontsize=11, weight="bold")
    line(ax, [(3.3, 10.4), (4.2, 10.4)])
    line(ax, [(3.25, 8.0), (3.8, 8.0), (3.8, 9.8), (4.2, 9.8)])
    # qozon 6
    ax.add_patch(Rectangle((8.4, 9.5), 2.2, 1.4, fc="white", ec="k", lw=LW))
    for xx in [8.7, 9.1, 9.5, 9.9, 10.3]:
        ax.plot([xx, xx], [9.6, 10.8], "k", lw=0.7)
    ax.text(9.5, 11.1, "6", ha="center", fontsize=10, weight="bold")
    line(ax, [(7.6, 10.2), (8.4, 10.2)])
    # kontakt apparat 7
    ax.add_patch(Rectangle((11.8, 3.4), 1.8, 8.4, fc="white", ec="k", lw=LW))
    for i, yy in enumerate([10.3, 8.4, 6.5, 4.0]):
        catalyst(ax, 11.85, yy, 1.7, 0.8); ax.text(13.75, yy + 0.3, f"{['I', 'II', 'III', 'IV'][i]}", fontsize=8)
    ax.plot([11.8, 13.6], [5.4, 5.4], "k", lw=2)
    ax.text(12.7, 12.05, "7", ha="center", fontsize=11, weight="bold")
    line(ax, [(10.6, 10.2), (11.0, 10.2), (11.0, 11.5), (11.8, 11.5)])
    # issiqlik almashtirgichlar 8
    for yy in [9.6, 7.7]:
        hx(ax, 14.9, yy, r=0.32)
        line(ax, [(13.6, yy + 0.3), (14.9, yy + 0.3), (14.9, yy + 0.32)], arrow=False)
    ax.text(15.35, 9.6, "8", fontsize=9, weight="bold", va="center")
    # ekonomayzer 9 va oraliq absorber 10
    hx(ax, 14.9, 5.8, r=0.32); ax.text(15.35, 5.8, "9", fontsize=9, weight="bold", va="center")
    line(ax, [(13.6, 6.6), (14.9, 6.6), (14.9, 6.12)])
    vessel(ax, 16.4, 2.2, 1.3, 5.0, r=0.25)
    catalyst(ax, 16.45, 3.6, 1.2, 2.2)
    ax.text(17.05, 6.4, "10", ha="center", fontsize=10, weight="bold")
    line(ax, [(14.9, 5.48), (14.9, 3.0), (16.4, 3.0)])
    line(ax, [(17.05, 7.2), (17.05, 7.9), (15.9, 7.9), (15.9, 4.4), (13.6, 4.4)])
    # yakuniy absorber 11
    vessel(ax, 19.0, 2.2, 1.3, 5.0, r=0.25)
    catalyst(ax, 19.05, 3.6, 1.2, 2.2)
    ax.text(19.65, 6.4, "11", ha="center", fontsize=10, weight="bold")
    line(ax, [(12.7, 3.4), (12.7, 1.4), (18.6, 1.4), (18.6, 3.0), (19.0, 3.0)])
    line(ax, [(19.65, 7.2), (19.65, 8.4)]); txt(ax, 19.0, 8.6, "Dum gaz\n(SO₂ ≈ 0,035 %)", fs=7)
    # kislota sikli 12, 13
    vessel(ax, 16.6, 0.2, 1.0, 0.8, num=12, r=0.2)
    line(ax, [(17.05, 2.2), (17.05, 1.0)])
    hx(ax, 18.3, 0.6, r=0.3); ax.text(18.75, 0.6, "13", fontsize=9, weight="bold", va="center")
    line(ax, [(17.6, 0.6), (18.0, 0.6)])
    line(ax, [(18.6, 0.6), (21.2, 0.6), (21.2, 7.6), (17.6, 7.6), (17.6, 7.2)], color="0.35")
    txt(ax, 20.6, 4.0, "H₂SO₄\n98,3 %", fs=7, color="0.3")
    txt(ax, 15.6, 0.1, "Mahsulot", fs=7)
    fig.tight_layout()
    fig.savefig(f"{OUT}/sxema5.png", dpi=170)


def absorber5():
    fig, ax = plt.subplots(figsize=(6.2, 8.0))
    ax.set_xlim(-4.2, 5.0); ax.set_ylim(-1.0, 12.5); ax.axis("off"); ax.set_aspect("equal")
    W = 2.4; x0 = -W / 2
    ax.add_patch(FancyBboxPatch((x0 - 0.25, 0.55), W + 0.5, 10.1, boxstyle="round,pad=0,rounding_size=0.6", fc="#e8d8c0", ec="k", lw=1.5))
    ax.add_patch(FancyBboxPatch((x0, 0.8), W, 9.6, boxstyle="round,pad=0,rounding_size=0.5", fc="white", ec="k", lw=1.5))
    catalyst(ax, x0 + 0.05, 2.6, W - 0.1, 4.8)
    ax.plot([x0, x0 + W], [2.55, 2.55], "k", lw=3)
    ax.plot([-0.9, 0.9], [8.1, 8.1], "k", lw=2)
    for xx in [-0.8, -0.4, 0, 0.4, 0.8]:
        ax.plot([xx, xx], [8.1, 7.85], "k", lw=1)
    ax.add_patch(Rectangle((x0 + 0.05, 9.0), W - 0.1, 0.35, fc="white", ec="k", hatch="xxx", lw=0.8))
    ax.add_patch(Rectangle((x0 + 0.05, 0.85), W - 0.1, 0.6, fc="#cfe2f3", ec="none"))
    ax.annotate("", xy=(0, 12.2), xytext=(0, 10.4), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.annotate("", xy=(0, -0.8), xytext=(0, 0.8), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.annotate("", xy=(x0, 1.9), xytext=(x0 - 1.6, 1.9), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.annotate("", xy=(x0, 8.5), xytext=(x0 - 1.6, 8.5), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.annotate("", xy=(x0, 11.6), xytext=(x0 + W, 11.6), arrowprops=dict(arrowstyle="<->")); ax.text(-3.6, 11.5, "D = 600 mm", fontsize=8.5)
    ax.annotate("", xy=(2.1, 2.6), xytext=(2.1, 7.4), arrowprops=dict(arrowstyle="<->")); ax.text(2.25, 4.4, "H = 4,0 m", fontsize=8.5, rotation=90)
    labels = [(12.0, "1 – gaz chiqishi"), (9.2, "2 – tomchi ushlagich (sham filtr)"), (8.0, "3 – kislota taqsimlagich"),
              (5.0, "4 – nasadka: keramik halqalar 50×50×5"), (2.55, "5 – kolosnik panjara"), (1.15, "6 – kislota yig‘gich"), (-0.6, "7 – kislota chiqishi (363 K)")]
    for y, s in labels:
        ax.text(2.9, y, s, fontsize=7.3, va="center")
    ax.text(-4.2, 8.75, "8 – kislota 98,3 %\n     (343 K)", fontsize=7.3)
    ax.text(-4.2, 2.15, "9 – SO₃ li gaz (453 K)", fontsize=7.3)
    ax.text(-4.2, 0.2, "10 – futerovka", fontsize=7.3)
    fig.tight_layout()
    fig.savefig(f"{OUT}/absorber5.png", dpi=170)


def xt5():
    d = json.load(open(f"{OUT}/xt5.json"))
    fig, ax = plt.subplots(figsize=(6.4, 4.2))
    T = [r[0] for r in d["eq"]]; x = [r[1] for r in d["eq"]]
    ax.plot(T, x, "k-", lw=1.8, label="Muvozanat chizig‘i")
    for i, b in enumerate(d["beds"]):
        (t0, x0), (t1, x1) = b
        ax.plot([t0, t1], [x0, x1], "k--", lw=1.4, label="Adiabatik qatlamlar" if i == 0 else None)
        ax.text(t1 + 3, x1 - 0.015, ["I", "II", "III"][i], fontsize=9)
        if i < 2:
            nt = d["beds"][i + 1][0]
            ax.plot([t1, nt[0]], [x1, x1], "k:", lw=1.0, label="Oraliq sovitish" if i == 0 else None)
    ax.set_xlabel("Harorat T, K"); ax.set_ylabel("SO₂ ning konversiya darajasi x")
    ax.set_xlim(660, 900); ax.set_ylim(0, 1.0); ax.grid(True, lw=0.3, color="0.8"); ax.legend(fontsize=8, loc="center left")
    fig.tight_layout()
    fig.savefig(f"{OUT}/xt5.png", dpi=170)


scheme5(); absorber5(); xt5()
