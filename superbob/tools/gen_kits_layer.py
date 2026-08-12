import sys,re,html
src,dst=sys.argv[1],sys.argv[2]
xml=open(src,encoding='utf8').read()
SBCOL={'Phase 1':'#6c8ebf','Phase 2':'#82b366','Phase 2.1':'#d79b00','Phase 3':'#9673a6','Phase 4':'#b85450'}
PST='#0e8088'
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
    W=1000; rowh=44; head=44
    Cm=[f'<mxCell id="{mLid}" value="How to use SuperBob" style="locked=0;" parent="{rootId}" />',
        f'<mxCell id="{mLid}_bg" value="" style="rounded=1;fillColor=#ffffff;strokeColor=#999999;opacity=80;" vertex="1" parent="{mLid}"><mxGeometry x="{x0}" y="{y0}" width="{W}" height="{head+rowh*len(rules)+14}" as="geometry"/></mxCell>',
        f'<mxCell id="{mLid}_h" value="How to use SuperBob in this stage — the kit to load at each step (blank = Bob or Propel handles it, no SuperBob kit needed).  Blue = SuperBob kit, teal = Propel." style="text;html=1;fontStyle=1;fontSize=13;align=left;verticalAlign=middle;whiteSpace=wrap;strokeColor=none;fillColor=none;" vertex="1" parent="{mLid}"><mxGeometry x="{x0+16}" y="{y0+8}" width="{W-32}" height="30" as="geometry"/></mxCell>']
    for i,(_,step,kits,prop) in enumerate(rules):
        ry=y0+head+i*rowh; parts=[]
        for k,w in kits: parts.append(f'<b><font color="{sb}">{k}</font></b> <font color="#777">to {w}</font>')
        for k,w in prop: parts.append(f'<b><font color="{PST}">Propel: {k}</font></b> <font color="#777">to {w}</font>')
        line=' &#183; '.join(parts) if parts else '<font color="#999">handled by Bob / Propel — no SuperBob kit needed</font>'
        raw=f'<b>{step}</b> &#8212; {line}'
        val=html.escape(raw, quote=True)
        Cm.append(f'<mxCell id="{mLid}_r{i}" value="{val}" style="text;html=1;fontSize=11;align=left;verticalAlign=middle;whiteSpace=wrap;strokeColor=#e5e7eb;fillColor=#fafbfc;spacingLeft=8;spacingRight=8;spacingTop=2;" vertex="1" parent="{mLid}"><mxGeometry x="{x0+12}" y="{int(ry)}" width="{W-24}" height="{rowh-6}" as="geometry"/></mxCell>')
    layer='\n        '+'\n        '.join(S+P+Cm)+'\n      '
    return f'{openTag}{re.sub(r"</root>",layer+"</root>",body,count=1)}</diagram>'
open(dst,'w',encoding='utf8').write(re.sub(r'(<diagram[^>]*name=")([^"]*)("[^>]*>)(.*?)</diagram>', proc, xml, flags=re.S))
print("wrote:",dst,"| pages:",pi[0])
