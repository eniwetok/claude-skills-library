import sys,re,html
src,dst=sys.argv[1],sys.argv[2]
VERSION=sys.argv[3] if len(sys.argv)>3 else '1.82.0'
DATE=sys.argv[4] if len(sys.argv)>4 else '2026-08-12'
STAMP=f'SuperBob kits mapping &#183; v{VERSION} &#183; {DATE}'
xml=open(src,encoding='utf8').read()
SBCOL={'Phase 1':'#6c8ebf','Phase 2':'#82b366','Phase 2.1':'#d79b00','Phase 3':'#9673a6','Phase 4':'#b85450'}
PST='#0e8088'
PORDER=['Phase 1','Phase 2','Phase 2.1','Phase 3','Phase 4']
PNAME={'Phase 1':'Phase 1 — Spec Creation','Phase 2':'Phase 2 — Implementation Planning','Phase 2.1':'Phase 2.1 — QA Planning','Phase 3':'Phase 3 — Development','Phase 4':'Phase 4 — QA Test Execution'}
PH_META={
 'Phase 1':('Turn a PM brief into a unified, dev + QA-approved spec via Bob interrogation.','Final Approved Spec'),
 'Phase 2':('Bob drafts the implementation plan; dev reviews; work is broken into Jira tasks.','Tasks in Jira'),
 'Phase 2.1':('QA agent drafts test plans & cases; QA reviews; uploaded to TestRail.','Test cases in TestRail'),
 'Phase 3':('Bob codes test-first; devs review PRs; CI/CD builds for QA.','Builds for QA'),
 'Phase 4':('Automated tests authored & run; devs fix failures; results logged.','Ship / no-ship decision'),
}
def pkey(name):
    n=name.lower()
    if 'spec creation' in n or name.startswith('Phase 1'): return 'Phase 1'
    if 'qa planning' in n or name.startswith('Phase 2.1'): return 'Phase 2.1'
    if 'implementation' in n or name.startswith('Phase 2'): return 'Phase 2'
    if 'development' in n or name.startswith('Phase 3'): return 'Phase 3'
    if 'qa test execution' in n or name.startswith('Phase 4'): return 'Phase 4'
def is_phase(name): return name.startswith('Phase')
# TIGHT, honest mapping: only kits a team would actually load at that step. Framed as usage.
M={
 'Phase 1':[
  ('Step 1 — PM Feature Brief','Step 1 — PM Feature Brief',[('product-management','refine the capability and its intent'),('product-frameworks','frame it as a job-to-be-done / opportunity')],[('Jira Skill','update the capability in Jira')]),
  ('Step 2 — PM Feature Brief','Step 2 — Create Epic',[('product-management','write the epic')],[('Product Epic Template','fill the epic template'),('Jira Skill','upload the epic to Jira')]),
  ('Refine Epic','Step 3 — Refine Epic',[('product-management','sharpen the epic with the team')],[]),
  ('Create spec','Step 4 — Create spec (Bob)',[('content-writing','tighten the spec prose Bob drafts'),('diagramming','sketch the screens / flows the spec describes')],[]),
  ('Clarify Bob questions','Step 5 — Clarify Bob questions',[('web-research','research answers to the open questions')],[]),
  ('pushes Spec to repo','Step 6 — Push Spec to repo',[],[]),
  ('Final PR Approval','Step 7 — Final PR Approval',[('release-review','run the pre-ship review'),('product-management','confirm business intent is preserved')],[]),
  ('creates stories in Jira','Step 8 — Create stories in Jira',[],[('Jira Skill','create the stories in Jira')]),
 ],
 'Phase 2':[
  ('creates Implementation Plan','Step 1 — Implementation Plan (Bob)',[('software-development','plan the technical approach'),('diagramming','draw the architecture / sequence diagrams'),('wiki','understand the codebase + capture design decisions')],[]),
  ('Dev Reviews Plan','Step 2 — Dev Reviews Plan',[('software-development','engineering review of the plan')],[]),
  ('break down work into Tasks','Step 3 — Break work into Tasks',[('software-development','decompose into buildable tasks')],[]),
  ('Uploads Tasks to Jira','Step 4 — Upload Tasks to Jira',[],[('Jira Skill','push tasks to Jira')]),
  ('Dev Reviews Tasks','Step 4 — Dev Reviews Tasks',[('software-development','check tasks are right-sized')],[]),
 ],
 'Phase 2.1':[
  ('triggers QA Agent','Step 1 — QA Agent creates Test Plans',[('test-engineering','design the test strategy')],[]),
  ('QA Reviews Test Plans','Step 2 — QA Reviews Test Plans',[('test-engineering','validate coverage')],[]),
  ('create test cases','Step 4 — QA Agent creates Test Cases',[('test-engineering','write the test cases')],[]),
  ('QA Reviews Test Cases','Step 5 — QA Reviews Test Cases',[('test-engineering','validate the cases')],[]),
  ('Upload test cases to Test Rail','Step 6 — Upload to Test Rail',[],[]),
 ],
 'Phase 3':[
  ('Bob start coding','Step 1 — Bob starts coding (TDD)',[('software-development','implement the feature'),('test-engineering','generate the unit tests (TDD)'),('frontend-design','build the UI when the feature has one'),('web-design','turn the Figma design into UI code')],[]),
  ('Dev Reviews Code PR','Step 2 — Dev Reviews Code PR',[('bug-fixing','catch defects before merge'),('code-simplification','cut over-engineering'),('application-security','check the PR for security issues')],[]),
  ('Update Task Progress in Jira','Step 3 — Update Task Progress in Jira',[],[('Jira Skill','update task status in Jira')]),
  ('Create builds for QA testing','Step 3 — Create builds for QA (CICD)',[('production-engineering','CI/CD builds and deploy to test')],[]),
 ],
 'Phase 4':[
  ('create automated tests','Step 1 — Create automated tests (Bob)',[('test-engineering','author the automated tests')],[]),
  ('QA Reviews Automated Tests','Step 2 — QA Reviews Automated Tests',[('test-engineering','validate the automation')],[]),
  ('run automated tests','Step 4 — Run automated tests',[('test-engineering','run the functional suite'),('application-security','run the security / pen tests')],[]),
  ('QA Reviews Test Reports','Step 5 — QA Reviews Test Reports',[('test-engineering','read the results'),('release-review','make the ship / no-ship call')],[]),
  ('fix issues found','Step 6 — Developer fixes issues',[('bug-fixing','fix the failures found')],[]),
  ('rerun test cases','Step 7 — Rerun test cases',[('test-engineering','re-run to confirm green')],[]),
  ('update test results into Test Rail','Step 7 — Update results in Test Rail',[],[]),
 ],
}
CELL=re.compile(r'<mxCell\b(?P<attrs>[^>]*?)(?:/>|>(?P<inner>.*?)</mxCell>)', re.S)
def at(a,n):
    m=re.search(n+r'="([^"]*)"',a); return m.group(1) if m else None
def geom(inner):
    g=re.search(r'<mxGeometry\b([^>]*)', inner or '')
    if not g: return None
    a=g.group(1); w=at(a,'width'); h=at(a,'height')
    if w is None or h is None: return None
    def num(k):
        try: return float(at(a,k))
        except: return 0.0
    return (num('x'),num('y'),float(w),float(h))
pi=[0]
def proc(mm):
    openTag=mm.group(1)+mm.group(2)+mm.group(3); name=mm.group(2); body=mm.group(4)
    pk=pkey(name)
    if not pk: return mm.group(0)
    sb=SBCOL[pk]; rules=M[pk]
    root=re.search(r'<root>(.*)</root>',body,re.S).group(1)
    rootId='0'
    for c in CELL.finditer(root):
        if 'parent=' not in c.group('attrs'): rootId=at(c.group('attrs'),'id'); break
    pi[0]+=1; sbLid=f'sbTags{pi[0]}'; pLid=f'propTags{pi[0]}'; mLid=f'kitmap{pi[0]}'
    S=[f'<mxCell id="{sbLid}" value="SuperBob Kits" style="locked=0;" parent="{rootId}" />']
    P=[f'<mxCell id="{pLid}" value="Propel" style="locked=0;" parent="{rootId}" />']
    xs=[];bt=[]; ti=0; used=set()
    if is_phase(name):
        for c in CELL.finditer(root):
            a=c.group('attrs'); v=at(a,'value') or ''; gm=geom(c.group('inner'))
            if gm: xs.append(gm[0]); bt.append(gm[1]+gm[3])
            if not (re.search(r'Step\s*\d',v) and at(a,'vertex')=='1' and gm): continue
            x,y,w,h=gm; norm=re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',v))
            rule=next((r for r in rules if r[0] in norm and r[0] not in used),None) or next((r for r in rules if r[0] in norm),None)
            if not rule: continue
            used.add(rule[0]); _,_,kits,prop=rule; ty=y+h+4; tw=int(w)
            if kits:
                ti+=1; S.append(f'<mxCell id="{sbLid}_{ti}" value="Load ▸ {html.escape(", ".join(k for k,_ in kits))}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f4f8ff;strokeColor={sb};fontColor={sb};dashed=1;fontSize=10;align=left;spacingLeft=6;" vertex="1" parent="{sbLid}"><mxGeometry x="{int(x)}" y="{int(ty)}" width="{tw}" height="22" as="geometry"/></mxCell>'); ty+=25
            if prop:
                ti+=1; P.append(f'<mxCell id="{pLid}_{ti}" value="Propel ▸ {html.escape(", ".join(k for k,_ in prop))}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e0f7f7;strokeColor={PST};fontColor={PST};fontSize=10;align=left;spacingLeft=6;" vertex="1" parent="{pLid}"><mxGeometry x="{int(x)}" y="{int(ty)}" width="{tw}" height="22" as="geometry"/></mxCell>')
    else:
        for c in CELL.finditer(root):
            g=geom(c.group('inner'))
            if g: xs.append(g[0]); bt.append(g[1]+g[3])
    x0=int(min(xs)) if xs else 40
    y0=int(max(bt))+120 if bt else 40
    W=1000; rowh=44; head=44; foot=22
    Cm=[f'<mxCell id="{mLid}" value="How to use SuperBob" style="locked=0;" parent="{rootId}" />',
        f'<mxCell id="{mLid}_bg" value="" style="rounded=1;fillColor=#ffffff;strokeColor=#999999;opacity=80;" vertex="1" parent="{mLid}"><mxGeometry x="{x0}" y="{y0}" width="{W}" height="{head+rowh*len(rules)+14+foot}" as="geometry"/></mxCell>',
        f'<mxCell id="{mLid}_h" value="How to use SuperBob in this stage — the kit to load at each step (blank = Bob or Propel handles it, no SuperBob kit needed).  Blue = SuperBob kit, teal = Propel." style="text;html=1;fontStyle=1;fontSize=13;align=left;verticalAlign=middle;whiteSpace=wrap;strokeColor=none;fillColor=none;" vertex="1" parent="{mLid}"><mxGeometry x="{x0+16}" y="{y0+8}" width="{W-32}" height="30" as="geometry"/></mxCell>']
    for i,(_,step,kits,prop) in enumerate(rules):
        ry=y0+head+i*rowh; parts=[]
        for k,w in kits: parts.append(f'<b><font color="{sb}">{k}</font></b> <font color="#777">to {w}</font>')
        for k,w in prop: parts.append(f'<b><font color="{PST}">Propel: {k}</font></b> <font color="#777">to {w}</font>')
        line=' &#183; '.join(parts) if parts else '<font color="#999">handled by Bob / Propel — no SuperBob kit needed</font>'
        raw=f'<b>{step}</b> &#8212; {line}'
        val=html.escape(raw, quote=True)
        Cm.append(f'<mxCell id="{mLid}_r{i}" value="{val}" style="text;html=1;fontSize=11;align=left;verticalAlign=middle;whiteSpace=wrap;strokeColor=#e5e7eb;fillColor=#fafbfc;spacingLeft=8;spacingRight=8;spacingTop=2;" vertex="1" parent="{mLid}"><mxGeometry x="{x0+12}" y="{int(ry)}" width="{W-24}" height="{rowh-6}" as="geometry"/></mxCell>')
    verY=y0+head+rowh*len(rules)+6
    Cm.append(f'<mxCell id="{mLid}_ver" value="{STAMP}" style="text;html=1;fontSize=10;fontColor=#9aa0a6;align=right;verticalAlign=middle;strokeColor=none;fillColor=none;" vertex="1" parent="{mLid}"><mxGeometry x="{x0+12}" y="{int(verY)}" width="{W-24}" height="16" as="geometry"/></mxCell>')
    layer='\n        '+'\n        '.join(S+P+Cm)+'\n      '
    return f'{openTag}{re.sub(r"</root>",layer+"</root>",body,count=1)}</diagram>'
def agg(pk):
    kits=[]; props=[]
    for (_,_,ks,ps) in M[pk]:
        for k,_ in ks:
            if k not in kits: kits.append(k)
        for k,_ in ps:
            if k not in props: props.append(k)
    return kits,props
def E(raw): return html.escape(raw, quote=True)
def phases_page():
    c=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>']
    c.append(f'<mxCell id="t" value="{E("Spec-Driven Development — End-to-End Phases")}" style="text;html=1;fontStyle=1;fontSize=20;align=center;" vertex="1" parent="1"><mxGeometry x="40" y="22" width="1620" height="32" as="geometry"/></mxCell>')
    c.append(f'<mxCell id="ts" value="{E("Input → five phases → shipped feature. Each phase output feeds the next. Colour = phase.")}" style="text;html=1;fontSize=13;fontColor=#666;align=center;" vertex="1" parent="1"><mxGeometry x="40" y="56" width="1620" height="22" as="geometry"/></mxCell>')
    y=140; h=155; bw=220; gap=40; x=40
    c.append(f'<mxCell id="in" value="{E("<b>Input</b><br>Jira Capability")}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#999999;fontSize=12;" vertex="1" parent="1"><mxGeometry x="{x}" y="{y+48}" width="120" height="60" as="geometry"/></mxCell>')
    prev='in'; x+=120+gap
    for i,pk in enumerate(PORDER):
        col=SBCOL[pk]; purpose,output=PH_META[pk]; pid=f'p{i}'
        raw=f'<b><font color="{col}">{PNAME[pk]}</font></b><br><br>{purpose}<br><br><b>&#8594; {output}</b>'
        c.append(f'<mxCell id="{pid}" value="{E(raw)}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor={col};fontSize=12;align=left;spacingLeft=10;spacingRight=10;verticalAlign=top;spacingTop=10;" vertex="1" parent="1"><mxGeometry x="{x}" y="{y}" width="{bw}" height="{h}" as="geometry"/></mxCell>')
        c.append(f'<mxCell id="e{i}" style="edgeStyle=orthogonalEdgeStyle;html=1;rounded=0;strokeColor=#999999;endArrow=block;endFill=1;" edge="1" parent="1" source="{prev}" target="{pid}"><mxGeometry relative="1" as="geometry"/></mxCell>')
        prev=pid; x+=bw+gap
    c.append(f'<mxCell id="out" value="{E("<b>Shipped</b><br>Feature")}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=12;" vertex="1" parent="1"><mxGeometry x="{x}" y="{y+48}" width="120" height="60" as="geometry"/></mxCell>')
    c.append(f'<mxCell id="eout" style="edgeStyle=orthogonalEdgeStyle;html=1;strokeColor=#999999;endArrow=block;endFill=1;" edge="1" parent="1" source="{prev}" target="out"><mxGeometry relative="1" as="geometry"/></mxCell>')
    c.append(f'<mxCell id="ver" value="{STAMP}" style="text;html=1;fontSize=10;fontColor=#9aa0a6;align=right;" vertex="1" parent="1"><mxGeometry x="40" y="{y+h+34}" width="1620" height="16" as="geometry"/></mxCell>')
    return '<diagram name="Overview — Phases" id="ov-phases"><mxGraphModel dx="1600" dy="900" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1700" pageHeight="560" math="0" shadow="0"><root>'+''.join(c)+'</root></mxGraphModel></diagram>'
def tools_page():
    c=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>']
    c.append(f'<mxCell id="t" value="{E("Tooling Across the Lifecycle — Kits & Tools End to End")}" style="text;html=1;fontStyle=1;fontSize=20;align=center;" vertex="1" parent="1"><mxGeometry x="40" y="22" width="1460" height="32" as="geometry"/></mxCell>')
    c.append(f'<mxCell id="ts" value="{E("Every SuperBob kit (blue) and Propel tool (teal) a team loads at each phase. Blank = handled by Bob / Propel, no kit needed.")}" style="text;html=1;fontSize=13;fontColor=#666;align=center;" vertex="1" parent="1"><mxGeometry x="40" y="56" width="1460" height="22" as="geometry"/></mxCell>')
    X0=40; wP=240; wK=740; wR=480; hy=100; hh=32
    def cell(cid,x,w,y,ht,val,style): c.append(f'<mxCell id="{cid}" value="{val}" style="{style}" vertex="1" parent="1"><mxGeometry x="{x}" y="{y}" width="{w}" height="{ht}" as="geometry"/></mxCell>')
    hs='text;html=1;fontStyle=1;fontSize=12;align=left;verticalAlign=middle;fillColor=#eef1f5;strokeColor=#c8ccd2;spacingLeft=10;'
    cell('h0',X0,wP,hy,hh,E("Phase"),hs); cell('h1',X0+wP,wK,hy,hh,E("SuperBob kits used"),hs); cell('h2',X0+wP+wK,wR,hy,hh,E("Propel tools used"),hs)
    y=hy+hh
    for i,pk in enumerate(PORDER):
        col=SBCOL[pk]; kits,props=agg(pk); rh=90
        cell(f'pr{i}',X0,wP,y,rh,E(f'<b><font color="{col}">{PNAME[pk]}</font></b>'),f'text;html=1;fontSize=12;align=left;verticalAlign=top;whiteSpace=wrap;fillColor=#ffffff;strokeColor=#e5e7eb;spacingLeft=10;spacingTop=8;')
        kraw=' &#183; '.join(f'<b><font color="{col}">{k}</font></b>' for k in kits) if kits else '<font color="#999">—</font>'
        cell(f'kr{i}',X0+wP,wK,y,rh,E(kraw),'text;html=1;fontSize=12;align=left;verticalAlign=top;whiteSpace=wrap;fillColor=#f8faff;strokeColor=#e5e7eb;spacingLeft=10;spacingTop=8;')
        praw=' &#183; '.join(f'<b><font color="{PST}">{k}</font></b>' for k in props) if props else '<font color="#999">— (Bob / Propel handles it)</font>'
        cell(f'rr{i}',X0+wP+wK,wR,y,rh,E(praw),'text;html=1;fontSize=12;align=left;verticalAlign=top;whiteSpace=wrap;fillColor=#e0f7f710;strokeColor=#e5e7eb;spacingLeft=10;spacingTop=8;')
        y+=rh
    c.append(f'<mxCell id="ver" value="{STAMP}" style="text;html=1;fontSize=10;fontColor=#9aa0a6;align=right;" vertex="1" parent="1"><mxGeometry x="{X0}" y="{y+16}" width="{wP+wK+wR}" height="16" as="geometry"/></mxCell>')
    return '<diagram name="Overview — Tools" id="ov-tools"><mxGraphModel dx="1500" dy="900" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1560" pageHeight="640" math="0" shadow="0"><root>'+''.join(c)+'</root></mxGraphModel></diagram>'
def process_detail_page():
    c=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>']
    c.append(f'<mxCell id="t" value="{E("Unified Process — Every Step, End to End")}" style="text;html=1;fontStyle=1;fontSize=20;align=center;" vertex="1" parent="1"><mxGeometry x="40" y="22" width="1660" height="32" as="geometry"/></mxCell>')
    c.append(f'<mxCell id="ts" value="{E("The whole delivery flow as one picture: five phases (columns) with each step in order. Colour = phase.")}" style="text;html=1;fontSize=13;fontColor=#666;align=center;" vertex="1" parent="1"><mxGeometry x="40" y="56" width="1660" height="22" as="geometry"/></mxCell>')
    colW=308; gap=24; x0=40; topY=100; hdrH=42; stepH=56; stepGap=12
    hids=[]
    for i,pk in enumerate(PORDER):
        x=x0+i*(colW+gap); col=SBCOL[pk]; hid=f'h{i}'; hids.append((hid,x))
        c.append(f'<mxCell id="{hid}" value="{E(PNAME[pk])}" style="rounded=1;whiteSpace=wrap;html=1;fillColor={col};strokeColor={col};fontColor=#ffffff;fontStyle=1;fontSize=13;" vertex="1" parent="1"><mxGeometry x="{x}" y="{topY}" width="{colW}" height="{hdrH}" as="geometry"/></mxCell>')
        y=topY+hdrH+14; prev=hid
        for j,(_,step,kits,prop) in enumerate(M[pk]):
            sid=f's{i}_{j}'; tags=[k for k,_ in kits]
            sub=(' &#183; '.join(tags)) if tags else 'Bob / Propel'
            raw=f'<b>{step}</b><br><font color="#888" style="font-size:10px">{sub}</font>'
            c.append(f'<mxCell id="{sid}" value="{E(raw)}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8faff;strokeColor={col};fontSize=11;align=left;spacingLeft=8;spacingRight=8;verticalAlign=middle;" vertex="1" parent="1"><mxGeometry x="{x}" y="{int(y)}" width="{colW}" height="{stepH}" as="geometry"/></mxCell>')
            c.append(f'<mxCell id="e{sid}" style="edgeStyle=orthogonalEdgeStyle;html=1;strokeColor={col};endArrow=block;endFill=1;strokeWidth=1;" edge="1" parent="1" source="{prev}" target="{sid}"><mxGeometry relative="1" as="geometry"/></mxCell>')
            prev=sid; y+=stepH+stepGap
    for a in range(len(hids)-1):
        (hid,_)=hids[a]; (hid2,_)=hids[a+1]
        c.append(f'<mxCell id="ph{a}" style="edgeStyle=orthogonalEdgeStyle;html=1;strokeColor=#999999;endArrow=block;endFill=1;dashed=1;" edge="1" parent="1" source="{hid}" target="{hid2}"><mxGeometry relative="1" as="geometry"/></mxCell>')
    c.append(f'<mxCell id="ver" value="{STAMP}" style="text;html=1;fontSize=10;fontColor=#9aa0a6;align=right;" vertex="1" parent="1"><mxGeometry x="40" y="640" width="1660" height="16" as="geometry"/></mxCell>')
    return '<diagram name="Process — Detailed" id="ov-process"><mxGraphModel dx="1660" dy="900" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1740" pageHeight="680" math="0" shadow="0"><root>'+''.join(c)+'</root></mxGraphModel></diagram>'
def tools_detail_page():
    c=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>']
    c.append(f'<mxCell id="t" value="{E("Detailed Toolings — Every Step, the Kit and Tool to Use (and why)")}" style="text;html=1;fontStyle=1;fontSize=20;align=center;" vertex="1" parent="1"><mxGeometry x="40" y="22" width="1560" height="32" as="geometry"/></mxCell>')
    c.append(f'<mxCell id="ts" value="{E("The master table: for each step, the SuperBob kit (blue) or Propel tool (teal) a team loads, and what it is for. Blank = Bob / Propel handles it.")}" style="text;html=1;fontSize=13;fontColor=#666;align=center;" vertex="1" parent="1"><mxGeometry x="40" y="56" width="1560" height="22" as="geometry"/></mxCell>')
    X0=40; wS=300; wK=780; wR=420; y=100; hh=32
    def cell(cid,x,w,yy,ht,val,style): c.append(f'<mxCell id="{cid}" value="{val}" style="{style}" vertex="1" parent="1"><mxGeometry x="{x}" y="{int(yy)}" width="{w}" height="{int(ht)}" as="geometry"/></mxCell>')
    hs='text;html=1;fontStyle=1;fontSize=12;align=left;verticalAlign=middle;fillColor=#eef1f5;strokeColor=#c8ccd2;spacingLeft=10;'
    cell('h0',X0,wS,y,hh,E("Step"),hs); cell('h1',X0+wS,wK,y,hh,E("SuperBob kit — what it is for"),hs); cell('h2',X0+wS+wK,wR,y,hh,E("Propel tool — what it is for"),hs)
    y+=hh; n=0
    for pk in PORDER:
        col=SBCOL[pk]
        cell(f'band{pk}'.replace(' ','').replace('.',''),X0,wS+wK+wR,y,26,E(f'<b><font color="{col}">{PNAME[pk]}</font></b>'),f'text;html=1;fontSize=12;align=left;verticalAlign=middle;fillColor=#f4f6f9;strokeColor=#dfe3e8;spacingLeft=10;')
        y+=26
        for (_,step,kits,prop) in M[pk]:
            rows=max(1,len(kits),len(prop)); rh=30+18*rows
            cell(f'st{n}',X0,wS,y,rh,E(f'<b><font color="{col}">{step}</font></b>'),'text;html=1;fontSize=11;align=left;verticalAlign=top;whiteSpace=wrap;fillColor=#ffffff;strokeColor=#e9ecf1;spacingLeft=10;spacingTop=6;')
            kraw='<br>'.join(f'<b><font color="{col}">{k}</font></b> <font color="#777">— {w}</font>' for k,w in kits) if kits else '<font color="#999">—</font>'
            cell(f'kt{n}',X0+wS,wK,y,rh,E(kraw),'text;html=1;fontSize=11;align=left;verticalAlign=top;whiteSpace=wrap;fillColor=#f8faff;strokeColor=#e9ecf1;spacingLeft=10;spacingTop=6;')
            praw='<br>'.join(f'<b><font color="{PST}">{k}</font></b> <font color="#777">— {w}</font>' for k,w in prop) if prop else '<font color="#999">—</font>'
            cell(f'pt{n}',X0+wS+wK,wR,y,rh,E(praw),'text;html=1;fontSize=11;align=left;verticalAlign=top;whiteSpace=wrap;fillColor=#fbfefe;strokeColor=#e9ecf1;spacingLeft=10;spacingTop=6;')
            y+=rh; n+=1
    c.append(f'<mxCell id="ver" value="{STAMP}" style="text;html=1;fontSize=10;fontColor=#9aa0a6;align=right;" vertex="1" parent="1"><mxGeometry x="{X0}" y="{int(y+14)}" width="{wS+wK+wR}" height="16" as="geometry"/></mxCell>')
    return '<diagram name="Tools — Detailed" id="ov-tools-detail"><mxGraphModel dx="1560" dy="1200" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1620" pageHeight="'+str(int(y+60))+'" math="0" shadow="0"><root>'+''.join(c)+'</root></mxGraphModel></diagram>'
out=re.sub(r'(<diagram[^>]*name=")([^"]*)("[^>]*>)(.*?)</diagram>', proc, xml, flags=re.S)
out=out.replace('</mxfile>', phases_page()+tools_page()+process_detail_page()+tools_detail_page()+'</mxfile>')
open(dst,'w',encoding='utf8').write(out)
print("wrote:",dst,"| phase/tool pages stamped v"+VERSION+" | mapped pages:",pi[0],"| +2 overview pages")
