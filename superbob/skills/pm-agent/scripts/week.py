#!/usr/bin/env python3
"""
pm-agent week/date helpers.

The pm-agent skill calls this to compute:
- Current ISO week (YYYY-Www)
- Period start (Monday) and end (Sunday) for a given week
- Whether today triggers a recipe's cadence (Monday for weekly, Friday for competitive, quarter-end for OKR review)
- ISO week arithmetic (prior week, next week)

Used to keep date math out of the skill prose.

Usage:
    python3 week.py current                 # → 2026-W22
    python3 week.py period 2026-W22         # → 2026-05-25 2026-05-31
    python3 week.py is-monday               # → true|false
    python3 week.py is-friday               # → true|false
    python3 week.py is-quarter-end-week     # → true|false
    python3 week.py prior 2026-W22          # → 2026-W21
    python3 week.py next 2026-W22           # → 2026-W23
    python3 week.py quarter                 # → 2026-Q2
"""
from __future__ import annotations
import sys
from datetime import date, timedelta


def parse_iso_week(s: str) -> tuple[int, int]:
    # "2026-W22" → (2026, 22)
    year, w = s.split("-W")
    return int(year), int(w)


def iso_week_str(d: date) -> str:
    iso = d.isocalendar()
    return f"{iso.year}-W{iso.week:02d}"


def monday_of_iso_week(year: int, week: int) -> date:
    # date.fromisocalendar is Python 3.8+
    return date.fromisocalendar(year, week, 1)  # 1 = Monday


def sunday_of_iso_week(year: int, week: int) -> date:
    return date.fromisocalendar(year, week, 7)


def current_quarter(d: date) -> str:
    q = (d.month - 1) // 3 + 1
    return f"{d.year}-Q{q}"


def is_quarter_end_week(d: date) -> bool:
    # Last week of quarter = week containing the last Monday of the quarter's last month
    # Approximation: weeks 13, 26, 39, 52 (ISO weeks)
    iso = d.isocalendar()
    return iso.week in (13, 26, 39, 52)


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 2

    cmd = argv[1]
    today = date.today()

    if cmd == "current":
        print(iso_week_str(today))
    elif cmd == "period":
        if len(argv) < 3:
            print("usage: period <YYYY-Www>", file=sys.stderr)
            return 2
        y, w = parse_iso_week(argv[2])
        start = monday_of_iso_week(y, w)
        end = sunday_of_iso_week(y, w)
        print(f"{start.isoformat()} {end.isoformat()}")
    elif cmd == "is-monday":
        print("true" if today.weekday() == 0 else "false")
    elif cmd == "is-friday":
        print("true" if today.weekday() == 4 else "false")
    elif cmd == "is-quarter-end-week":
        print("true" if is_quarter_end_week(today) else "false")
    elif cmd == "prior":
        if len(argv) < 3:
            print("usage: prior <YYYY-Www>", file=sys.stderr)
            return 2
        y, w = parse_iso_week(argv[2])
        monday = monday_of_iso_week(y, w)
        prior_monday = monday - timedelta(days=7)
        print(iso_week_str(prior_monday))
    elif cmd == "next":
        if len(argv) < 3:
            print("usage: next <YYYY-Www>", file=sys.stderr)
            return 2
        y, w = parse_iso_week(argv[2])
        monday = monday_of_iso_week(y, w)
        next_monday = monday + timedelta(days=7)
        print(iso_week_str(next_monday))
    elif cmd == "quarter":
        print(current_quarter(today))
    else:
        print(f"unknown command: {cmd}", file=sys.stderr)
        print(__doc__, file=sys.stderr)
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
