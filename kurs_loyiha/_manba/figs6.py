"""6-loyiha (ammiakli soda, filtratsiya bo'limi) uchun sxema, filtr chizmasi va grafik."""
import sys, os, json, math
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon, Circle, Wedge, FancyBboxPatch
sys.path.insert(0, os.path.dirname(__file__))
from figs import vessel, hx, comp, line, txt, catalyst, LW  # noqa: E402

OUT = sys.argv[1]


def drumfilter(ax, cx, cy, r, num=None):
    ax.add_patch(Polygon([[cx - r - 0.3, cy - 0.1], [cx + r + 0.3, cy - 0.1], [cx + r * 0.8, cy - r - 0.3], [cx - r * 0.8, cy - r - 0.3]], fc="#cfe2f3", ec="k", lw=LW))
    ax.add_patch(Circle((cx, cy), r, fc="white", ec="k", lw=LW))
    ax.add_patch(Circle((cx, cy), r * 0.15, fc="k"))
    if num is not None:
        ax.text(cx, cy + r + 0.2, str(num), ha="center", fontsize=10, weight="bold")


def scheme6():
    fig, ax = plt.subplots(figsize=(11, 6.4))
    ax.set_xlim(0, 22); ax.set_ylim(0, 12.8); ax.axis("off")
    # namakob
    txt(ax, 0.1, 12.2, "Tozalangan namakob\n(NaCl 305 kg/m³)", fs=7.5)
    vessel(ax, 0.6, 8.6, 1.6, 2.4, num=1, r=0.2)
    line(ax, [(0.9, 11.8), (1.4, 11.8), (1.4, 11.0)])
    # ammiaklash absorberi 2
    vessel(ax, 3.2, 6.0, 1.2, 5.2, num=2, r=0.3)
    line(ax, [(1.4, 8.6), (1.4, 8.0), (2.7, 8.0), (2.7, 10.6), (3.2, 10.6)])
    txt(ax, 2.2, 5.3, "NH₃ + CO₂\n(distillyatsiyadan)", fs=7)
    line(ax, [(2.9, 5.6), (2.9, 6.6), (3.2, 6.6)])
    # karbonizatsiya kolonnasi 3
    ax.add_patch(Rectangle((5.6, 1.6), 1.4, 10.0, fc="white", ec="k", lw=LW))
    for yy in [2.4 + 0.7 * i for i in range(13)]:
        ax.plot([5.6, 7.0], [yy, yy], "k", lw=0.6)
    ax.text(6.3, 11.85, "3", ha="center", fontsize=11, weight="bold")
    line(ax, [(3.8, 6.0), (3.8, 5.0), (5.0, 5.0), (5.0, 11.0), (5.6, 11.0)])
    txt(ax, 4.3, 1.2, "CO₂ (kalsinatsiya va\noxak pechi gazi)", fs=7)
    line(ax, [(5.0, 1.6), (5.0, 2.2), (5.6, 2.2)])
    # suspenziya -> filtr 4
    drumfilter(ax, 10.2, 4.6, 1.3); ax.text(11.25, 5.85, "4", fontsize=10, weight="bold")
    line(ax, [(6.3, 1.6), (6.3, 0.8), (8.4, 0.8), (8.4, 3.9), (8.8, 3.9)])
    txt(ax, 7.1, 0.35, "NaHCO₃ suspenziyasi", fs=7)
    # yuvish suvi
    line(ax, [(10.2, 7.4), (10.2, 6.0)], color="tab:blue"); txt(ax, 9.4, 7.55, "Yuvish suvi", fs=7, color="tab:blue")
    # vakuum: separator 5, nasos 6
    vessel(ax, 12.9, 6.0, 1.0, 1.8, num=5, r=0.2)
    line(ax, [(10.2, 4.6), (11.8, 4.6), (11.8, 6.9), (12.9, 6.9)])
    comp(ax, 15.2, 8.6, num=6)
    line(ax, [(13.4, 7.8), (13.4, 8.6), (14.85, 8.6)])
    line(ax, [(15.55, 8.6), (16.4, 8.6), (16.4, 9.6)]); txt(ax, 15.6, 9.8, "Havo (NH₃ ushlashga)", fs=7)
    # filtrat yig'gich 7, nasos 8
    vessel(ax, 12.7, 2.6, 1.4, 1.6, num=7, r=0.3)
    line(ax, [(13.4, 6.0), (13.4, 4.2)])
    comp(ax, 15.2, 3.0, r=0.3, pump=True); ax.text(15.2, 2.45, "8", ha="center", fontsize=9, weight="bold")
    line(ax, [(14.1, 3.0), (14.9, 3.0)])
    line(ax, [(15.5, 3.0), (17.0, 3.0)]); txt(ax, 15.8, 2.3, "Filtrat\ndistillyatsiyaga", fs=7)
    # kek -> konveyer 9 -> kalsinator 10
    ax.add_patch(Rectangle((11.6, 0.9), 4.4, 0.35, fc="white", ec="k", lw=LW)); ax.add_patch(Circle((11.6, 1.07), 0.18, fc="white", ec="k")); ax.add_patch(Circle((16.0, 1.07), 0.18, fc="white", ec="k"))
    ax.text(13.8, 0.45, "9", ha="center", fontsize=10, weight="bold")
    line(ax, [(11.4, 3.6), (11.7, 1.25)])
    ax.add_patch(Polygon([[17.0, 1.2], [21.6, 2.0], [21.6, 3.2], [17.0, 2.4]], fc="#fbe3d0", ec="k", lw=LW))
    ax.text(19.3, 2.2, "10", ha="center", va="center", fontsize=11, weight="bold")
    line(ax, [(16.2, 1.07), (17.0, 1.6)])
    line(ax, [(21.6, 2.6), (21.9, 2.6), (21.9, 4.2)]); txt(ax, 20.2, 4.3, "Soda (8,07 t/soat)", fs=7.5)
    line(ax, [(17.2, 2.35), (17.2, 5.0)], color="0.35"); txt(ax, 16.3, 5.1, "CO₂ + NH₃ + H₂O", fs=7, color="0.3")
    fig.tight_layout()
    fig.savefig(f"{OUT}/sxema6.png", dpi=170)


def filter6():
    fig, ax = plt.subplots(figsize=(7.4, 6.0))
    ax.set_xlim(-4.2, 4.8); ax.set_ylim(-3.6, 3.8); ax.axis("off"); ax.set_aspect("equal")
    R = 2.2
    # vanna
    ax.add_patch(Polygon([[-R - 0.4, -0.3], [R + 0.4, -0.3], [R * 0.75, -R - 0.6], [-R * 0.75, -R - 0.6]], fc="#cfe2f3", ec="k", lw=1.5))
    # zonalar (soat strelkasiga teskari aylanish; burchak 0 – o'ngda)
    zones = [(-150, -20, "#f2f2f2", "Filtrlash (130°)"), (-20, 50, "#e2efd9", "Yuvish (70°)"), (50, 130, "#fff2cc", "Quritish (80°)"),
             (130, 170, "#fbe3d0", "Kekni olish (40°)"), (170, 210, "#ffffff", "O‘lik zona")]
    for a0, a1, col, lab in zones:
        ax.add_patch(Wedge((0, 0), R, a0, a1, fc=col, ec="k", lw=0.8))
        am = math.radians((a0 + a1) / 2)
        ax.text(1.05 * R * math.cos(am) + (0.15 if math.cos(am) > 0 else -0.15), 1.05 * R * math.sin(am), lab, fontsize=7.5,
                ha="left" if math.cos(am) > 0 else "right", va="center")
    ax.add_patch(Circle((0, 0), R * 0.25, fc="white", ec="k", lw=1.2)); ax.text(0, 0, "taqsimlash\nboshchasi", fontsize=6, ha="center", va="center")
    ax.add_patch(Circle((0, 0), R + 0.08, fill=False, ec="k", lw=2.5))
    # pichoq
    ax.plot([-R - 0.1, -R - 1.1], [0.55, 1.1], "k", lw=2.5); ax.text(-R - 1.9, 1.25, "pichoq", fontsize=7.5)
    # yuvish forsunkalari
    for a in [5, 25, 45]:
        x, y = (R + 0.6) * math.cos(math.radians(a)), (R + 0.6) * math.sin(math.radians(a))
        ax.add_patch(Circle((x, y), 0.08, fc="tab:blue", ec="tab:blue"))
    ax.annotate("", xy=(-0.9, 2.55), xytext=(0.9, 2.55), arrowprops=dict(arrowstyle="-|>", connectionstyle="arc3,rad=0.3", lw=1.3))
    ax.text(-0.9, 3.1, "aylanish (n = 0,5 ayl/min)", fontsize=7.5)
    ax.annotate("", xy=(-R, -3.2), xytext=(R, -3.2), arrowprops=dict(arrowstyle="<->")); ax.text(-0.75, -3.5, "D = 2600 mm", fontsize=8)
    ax.text(-0.6, -2.4, "suspenziya", fontsize=7.5)
    fig.tight_layout()
    fig.savefig(f"{OUT}/filtr6.png", dpi=170)


def chart6():
    d = json.load(open(f"{OUT}/filt6.json"))
    fig, ax = plt.subplots(figsize=(6.4, 3.9))
    t = [r[0] for r in d["curve"]]; q = [r[1] * 1000 for r in d["curve"]]
    ax.plot(t, q, "k-", lw=1.8, label="q(τ) – Rut tenglamasi")
    ax.axvline(d["tf"], color="0.4", ls="--", lw=1); ax.text(d["tf"] + 1, q[-1] * 0.25, f"τ_f = {d['tf']:.1f} s\n(n = 0,5 ayl/min)", fontsize=7.5)
    ax.set_xlabel("Filtrlash vaqti τ, s"); ax.set_ylabel("Solishtirma filtrat hajmi q, l/m²")
    ax.grid(True, lw=0.3, color="0.8"); ax.legend(fontsize=8, loc="lower right")
    fig.tight_layout()
    fig.savefig(f"{OUT}/chart6.png", dpi=170)


scheme6(); filter6(); chart6()
