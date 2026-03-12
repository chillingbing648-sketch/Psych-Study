'use strict';
/* ═══════════════════════════════════════════════════════════
   PSYCHOLOGY OF ADJUSTMENT — STUDY COMPANION
   script.js  |  Full knowledge base extracted from PDF +
               complete app logic: navigation, study modes,
               flashcards, notes (localStorage), quiz, exam
   ═══════════════════════════════════════════════════════════ */

// ─── KNOWLEDGE BASE (from PDF: Psychology of Adjustment) ─────────────────────
const KB = [
  {
    id:'psych-disorders',
    name:'What Are Psychological Disorders?',
    category:'Foundations',
    icon:'🏥',
    preview:'Understanding psychological disorders beyond simple "abnormal" behaviour.',
    definition:'A psychological disorder involves persistent patterns of thoughts, feelings, or behaviours that cause significant distress, dysfunction, deviance from social norms, or danger to the individual or others.',
    explanation:`Psychological disorder does not simply mean "abnormal" behaviour. Many disorders such as depression and anxiety are statistically common yet clinically significant. Not all socially unusual behaviours (e.g., streaking) qualify as disorders.

The modern understanding recognises that psychological disorders involve clusters of symptoms that interfere with a person's daily functioning, emotional well-being, relationships, or physical health. These clusters form the basis of modern diagnostic systems such as the DSM-5.

There is no single universal definition of a psychological disorder. What counts as normal or abnormal varies across cultures, time periods, and social norms. Despite this ambiguity, recognisable patterns of dysfunction guide diagnosis and treatment.`,
    keyPoints:[
      'Psychological disorder ≠ simply abnormal behaviour',
      'Common disorders (depression, anxiety) are not statistically rare',
      'Symptoms must cause clinically significant distress or impairment',
      'Defined by patterns of thought, feeling, or behaviour over time',
      'The DSM-5 is the primary diagnostic classification system'
    ],
    types:['Anxiety Disorders','Mood Disorders','Psychotic Disorders','Eating Disorders','Personality Disorders'],
    symptoms:['Persistent distress or sadness','Impaired daily functioning','Social withdrawal','Bizarre or erratic behaviour','Persistent irrational fears'],
    psychologists:['APA — Publishes the DSM diagnostic manual','Emil Kraepelin — Founded modern psychiatric classification'],
    examples:['Lisa (case study) — grief, depression, and work dysfunction after loss of parents','A person with major depression unable to leave their bed for days'],
    treatment:'Psychological disorders are treated through psychotherapy (CBT, psychoanalysis, person-centred therapy), pharmacological interventions, or a combination of both approaches.',
    summary:'Psychological disorders are clinically significant patterns of distress or dysfunction. They are diagnosed using the four Ds criteria and classified using DSM-5 diagnostic criteria by trained mental health professionals.',
    mnemonic:'The Four Ds: Distress · Dysfunction · Deviance · Danger'
  },
  {
    id:'four-ds',
    name:'Four Criteria of Abnormality (The 4 Ds)',
    category:'Foundations',
    icon:'📐',
    preview:'Distress, Dysfunction, Deviance, Danger — the criteria for defining abnormal behaviour.',
    definition:'The four Ds are the primary criteria used to determine whether a pattern of behaviour constitutes a psychological disorder: Distress, Dysfunction, Deviance, and Danger.',
    explanation:`Distress refers to significant emotional suffering caused by the behaviour or experience — for example, intense grief, persistent sadness, or overwhelming fear. This criterion emphasises subjective suffering.

Dysfunction means that the behaviour interferes significantly with the person's ability to carry out daily responsibilities — such as maintaining work performance, social relationships, or self-care. Lisa, in the case study, exemplified dysfunction by missing work and being unable to manage household tasks.

Deviance involves behaviours that fall far outside the norms of the person's cultural or social context. However, deviance alone is not sufficient — it must be considered in context. For example, unusual religious practices may appear deviant but are culturally normal.

Danger refers to behaviour that poses a risk to the person or others — such as suicidal behaviour or serious aggression. This is the least common criterion and not required for diagnosis in all cases.`,
    keyPoints:[
      'Distress — causes significant emotional or psychological suffering',
      'Dysfunction — impairs work, relationships, or daily activities',
      'Deviance — behaviour outside accepted social or cultural norms',
      'Danger — poses risk to self or others (least common criterion)',
      'Multiple criteria must often be present for a clinical diagnosis'
    ],
    types:['Distress — subjective suffering','Dysfunction — objective impairment','Deviance — norm violation','Danger — risk to self or others'],
    symptoms:['Intense emotional suffering','Inability to perform normal roles','Socially unacceptable behaviour patterns','Self-harming or dangerous acts'],
    psychologists:['Rosenhan (1973) — On being sane in insane places','Thomas Szasz — Challenged the concept of mental illness'],
    examples:['Lisa missing work and unable to manage her household after bereavement (Dysfunction)','A person experiencing severe panic attacks every day (Distress)'],
    treatment:'Treatment is guided by which criteria are most prominent. Distress is addressed through psychotherapy; dysfunction through rehabilitation and skills training; danger through crisis intervention.',
    summary:'The Four Ds provide a practical framework for identifying psychological disorders. All four criteria are relevant, though not all must be present simultaneously. Context and cultural sensitivity are essential when applying these criteria.',
    mnemonic:'DDDD — Distress, Dysfunction, Deviance, Danger'
  },
  {
    id:'dsm',
    name:'The DSM and Diagnostic Classification',
    category:'Foundations',
    icon:'📖',
    preview:'The DSM is the leading system for classifying and diagnosing psychological disorders worldwide.',
    definition:'The Diagnostic and Statistical Manual of Mental Disorders (DSM), published by the American Psychiatric Association, is the primary classification system used by clinicians to diagnose over 200 psychological disorders.',
    explanation:`The DSM was first published in 1952 and has undergone multiple revisions as scientific understanding of mental health has evolved. The latest major update, DSM-5, was published in 2013 and provides standardised criteria for clinicians worldwide.

The DSM focuses on identifying patterns of symptoms rather than interpreting causes. This is because for many disorders, the exact causes remain unknown. Clinicians use the DSM by comparing an individual's symptoms with the descriptions and criteria listed for each disorder.

Importantly, the DSM uses person-first language — referring to "a person with schizophrenia" rather than "a schizophrenic." This approach promotes empathy and reduces stigma in clinical settings.

The DSM reflects scientific updates and societal changes over time. A landmark example is the removal of homosexuality from the DSM in 1974, reflecting both evolving scientific evidence and changing social attitudes.`,
    keyPoints:[
      'Published by the American Psychiatric Association (APA)',
      'Current edition is DSM-5 (published 2013)',
      'Diagnoses over 200 psychological disorders',
      'Focuses on symptoms, not causes (descriptive approach)',
      'Uses person-first language to reduce stigma'
    ],
    types:['DSM-I (1952)','DSM-II (1968)','DSM-III (1980) — first multi-axial','DSM-IV (1994)','DSM-5 (2013) — current edition'],
    symptoms:['Clinicians compare patient symptoms to DSM criteria','Duration, severity, and impact assessed','Shared diagnostic language across clinicians'],
    psychologists:['American Psychiatric Association — publishers','Robert Spitzer — led development of DSM-III'],
    examples:['Homosexuality removed from DSM in 1974 — reflecting changing cultural and scientific understanding','OCD diagnosed when intrusive thoughts and compulsions cause > 1 hour of distress daily'],
    treatment:'The DSM guides treatment selection by helping clinicians match disorders to evidence-based interventions — such as CBT for depression or exposure therapy for phobias.',
    summary:'The DSM is the global standard for diagnosing psychological disorders. It is descriptive, symptom-focused, and regularly updated to reflect evolving science and cultural understanding. Its person-first approach helps reduce stigma.',
    mnemonic:'DSM = Diagnostic Statistical Manual — "Describe Symptoms Methodically"'
  },
  {
    id:'culture-mental-illness',
    name:'Mental Illness Across Time and Culture',
    category:'Foundations',
    icon:'🌍',
    preview:'How culture, history, and social context shape the definition of mental illness.',
    definition:'The understanding and classification of mental illness varies significantly across different historical periods and cultural contexts, showing that what is considered "abnormal" is not fixed but shaped by social, cultural, and scientific factors.',
    explanation:`Throughout history, mental disorders have been explained in vastly different ways. In ancient times, unusual behaviour was often attributed to supernatural forces or demonic possession. As psychology and psychiatry developed, medical and scientific explanations replaced these beliefs.

An example of historical change is the reclassification of homosexuality: once labelled a disorder due to moral social beliefs, it was later understood as a natural variation of human sexuality and removed from the DSM in 1974. Similarly, "hysteria" — once extremely common among women — has disappeared from diagnostic systems as society and medicine evolved.

Culture shapes how people interpret thoughts, emotions, and behaviours. For example, hearing voices of deceased individuals is generally considered a symptom of schizophrenia in Western societies, but in many traditional Native American communities, it is viewed as a spiritual experience and not pathological.

In parts of the Middle East, visions and auditory experiences are often interpreted as spiritual gifts. These cultural differences show that psychological symptoms must always be understood within their social and cultural contexts.`,
    keyPoints:[
      'Definitions of mental illness change across history and cultures',
      'Homosexuality was removed from the DSM in 1974',
      'Hearing voices may be spiritual in some cultures, pathological in others',
      '"Hysteria" diagnosis has disappeared as understanding evolved',
      'Culture-bound syndromes reflect unique cultural expressions of distress'
    ],
    types:['Historical shifts in diagnosis','Cross-cultural variations','Culture-bound syndromes','Colonial psychiatry'],
    symptoms:['Culture-specific expressions of distress','Behaviours normal in one culture, pathological in another'],
    psychologists:['Arthur Kleinman — Pioneered cross-cultural psychiatry','George Devereux — Founded ethno-psychiatry'],
    examples:['Hearing ancestral voices — pathology in Western medicine, spirituality in Native American culture','Grisi siknis (Central America) — running frenzied with intense anxiety and anger','Hikikomori (Japan) — prolonged social withdrawal due to social pressure'],
    treatment:'Culturally competent care requires clinicians to understand the patient\'s cultural background, beliefs, and the cultural meaning of their symptoms before making a diagnosis.',
    summary:'Mental illness is not defined by universal, fixed criteria. Historical periods and cultural contexts fundamentally shape what is considered abnormal. Culture-bound syndromes and historical reclassifications demonstrate that diagnosis must always be sensitive to social and cultural context.',
    mnemonic:'CHS — Culture · History · Society shape our understanding of mental illness'
  },
  {
    id:'culture-bound',
    name:'Culture-Bound Syndromes',
    category:'Foundations',
    icon:'🌐',
    preview:'Psychological disorders that exist primarily within specific cultural or regional groups.',
    definition:'Culture-bound syndromes are psychological conditions that are specific to particular cultural groups and reflect the unique ways that culture shapes the experience and expression of psychological distress.',
    explanation:`Some psychological disorders exist primarily within certain cultural or regional groups. These are known as culture-bound syndromes, and they illustrate how cultural beliefs shape the form that psychological distress takes.

Grisi siknis is found mainly in Central America and is characterised by intense headaches, extreme anxiety, sudden anger, and episodes where the person begins running frenziedly without control. The condition is often explained in spiritual terms within the affected communities.

Hikikomori is found mostly in Japan, where individuals isolate themselves in their rooms for months or even years due to overwhelming social pressures related to academic performance and social expectations. It reflects Japan's intense cultural emphasis on social success.

Dhat syndrome is prevalent in South Asia, where men believe that losing semen through nocturnal emissions or masturbation causes physical and psychological weakness, including fatigue, anxiety, and sexual dysfunction.

These syndromes challenge universal definitions of mental illness and highlight the difficulty of applying Western diagnostic categories globally. They demonstrate that culture is not merely a context for mental illness — it actively shapes its expression.`,
    keyPoints:[
      'Culture-bound syndromes are culturally specific forms of psychological distress',
      'Grisi siknis — Central America — anxiety, anger, running episodes',
      'Hikikomori — Japan — extreme social withdrawal, months-long isolation',
      'Dhat syndrome — South Asia — belief semen loss causes weakness',
      'These syndromes challenge universal diagnostic systems like DSM'
    ],
    types:['Grisi siknis (Central America)','Hikikomori (Japan)','Dhat syndrome (South Asia)','Windigo (Native North America)','Susto (Latin America)','Koro (Southeast Asia)'],
    symptoms:['Culturally specific fears and behaviours','Symptoms explained in cultural or spiritual terms','Often misdiagnosed when using Western criteria'],
    psychologists:['Roberto Lewis-Fernández — Research on culture-bound syndromes','Sing Lee — Research on hikikomori and cultural psychiatry'],
    examples:['A Japanese student withdrawing for 2 years after exam failure (hikikomori)','A South Asian man presenting with fatigue, anxiety, and concern about semen loss (Dhat)'],
    treatment:'Treatment requires cultural competence — integrating traditional cultural healers, understanding cultural explanations, and adapting Western therapeutic models to fit cultural beliefs.',
    summary:'Culture-bound syndromes are unique expressions of psychological distress shaped by specific cultural beliefs and social pressures. They demonstrate that mental illness cannot be understood without understanding culture, and that global diagnostic systems must be applied with cultural sensitivity.',
    mnemonic:'GHD — Grisi siknis · Hikikomori · Dhat syndrome (three key examples)'
  },
  {
    id:'stigma',
    name:'Stigma in Mental Health',
    category:'Foundations',
    icon:'🚫',
    preview:'How stigma creates barriers that prevent people from seeking mental health treatment.',
    definition:'Stigma refers to the negative attitudes, stereotypes, and discrimination directed toward individuals with mental illness, which creates serious barriers to treatment, social inclusion, and personal well-being.',
    explanation:`Stigma creates barriers that prevent people from seeking help, maintaining relationships, and accessing opportunities in education and employment. Research shows that many people would rather admit to a minor criminal offence than reveal that they have been hospitalised for a mental health disorder.

Families sometimes hide mental health issues due to fear of social judgment, shame, or discrimination. This contributes to isolation, delayed treatment, and worsened outcomes for the affected person.

Using respectful language is an important tool for reducing stigma. For example, saying "a person living with depression" instead of "a depressed person" shifts the language from defining a person by their illness to recognising their full humanity. Similarly, avoiding offensive terms such as "crazy," "lunatic," or "psycho" helps create a more supportive environment.

Stigma operates at multiple levels: public stigma involves societal stereotypes and discrimination; self-stigma involves the internalisation of those negative beliefs by the person with the disorder, leading to shame, reduced self-esteem, and reluctance to seek help.`,
    keyPoints:[
      'Stigma = negative attitudes, stereotypes, and discrimination toward mental illness',
      'Public stigma — societal discrimination and stereotypes',
      'Self-stigma — internalisation of shame by the affected person',
      'Person-first language reduces stigma (e.g., "person with schizophrenia")',
      'Stigma is a major barrier to seeking professional help'
    ],
    types:['Public stigma','Self-stigma (internalised stigma)','Structural stigma (institutional barriers)','Courtesy stigma (affecting families)'],
    symptoms:['Avoidance of help-seeking','Social withdrawal and isolation','Shame and reduced self-esteem','Delayed or inadequate treatment'],
    psychologists:['Erving Goffman — Coined the sociological concept of stigma','Patrick Corrigan — Research on mental health stigma reduction'],
    examples:['People preferring to admit to a crime rather than reveal psychiatric hospitalisation','A family hiding a relative\'s schizophrenia diagnosis from neighbours to avoid shame'],
    treatment:'Anti-stigma campaigns, mental health education, personal contact with individuals with mental illness, and media portrayal reforms are evidence-based approaches to reducing stigma.',
    summary:'Stigma is a powerful barrier to mental health care and social inclusion. It operates at public, personal, and institutional levels. Using person-first language, increasing public education, and encouraging open conversations about mental health are essential steps in reducing stigma.',
    mnemonic:'STAMP out Stigma: Stereotypes · Treatment barriers · Attitudes · Media · Person-first language'
  },
  {
    id:'gad',
    name:'Generalised Anxiety Disorder (GAD)',
    category:'Anxiety Disorders',
    icon:'😰',
    preview:'Persistent "free-floating" anxiety that follows the person everywhere, without a clear cause.',
    definition:'Generalised Anxiety Disorder (GAD) is characterised by persistent, excessive, and uncontrollable worry about multiple life areas, accompanied by physical symptoms, that is present most days for at least six months and causes significant distress or impairment.',
    explanation:`GAD is often described as "free-floating" anxiety — the anxiety seems to follow the person everywhere and they often cannot identify a specific cause for their worry. Unlike phobias or panic disorder where fear is triggered by specific cues, GAD involves pervasive, generalised worry about everyday life events.

A person with GAD might constantly worry that a family member is unsafe even when there is no apparent danger, or may feel unable to stop worrying about finances, work, health, or relationships. The worry feels uncontrollable and disproportionate to the actual situation.

Physical symptoms are prominent in GAD and include chronic headaches, muscular tension, digestive problems, and constant physical fatigue. People with GAD often appear restless or edgy and may display strained facial expressions or fidgeting.

GAD is highly comorbid with depression, social anxiety, and substance use disorders. Some individuals fear that their anxiety will make them "go crazy" or cause a serious physical illness, which perpetuates the anxiety cycle.`,
    keyPoints:[
      'Persistent "free-floating" anxiety — no specific trigger identified',
      'Worry must be present most days for at least 6 months (DSM-5)',
      'Physical symptoms: headaches, muscle tension, fatigue, indigestion',
      'Difficulty concentrating and making decisions',
      'Highly comorbid with depression and other anxiety disorders'
    ],
    types:['Worry-predominant GAD','Somatic symptom-predominant GAD'],
    symptoms:['Constant, uncontrollable worry','Difficulty identifying what they fear','Physical: headaches, muscle tension, indigestion, fatigue','Difficulty concentrating or making decisions','Restlessness and irritability','Fear that anxiety will cause physical or mental harm'],
    psychologists:['Monroe & Reid (2009) — Research on anxiety and everyday stressors','David Barlow — Influential model of GAD'],
    examples:['A person worrying constantly about their family\'s safety even when nothing is wrong','A student unable to stop worrying about exam results for months, unable to sleep or concentrate'],
    treatment:'CBT (particularly relaxation training and cognitive restructuring), mindfulness-based therapy, and SSRIs are the most evidence-based treatments for GAD.',
    summary:'GAD involves chronic, pervasive worry without a specific object, accompanied by physical symptoms. Unlike normal anxiety which is temporary and manageable, GAD persists for at least six months and significantly impairs daily functioning. CBT and medication are the primary treatments.',
    mnemonic:'GAD = Generalised Anxiety that persists for ≥6 Days per week for ≥6 months (excessive worry)'
  },
  {
    id:'panic',
    name:'Panic Disorder',
    category:'Anxiety Disorders',
    icon:'💥',
    preview:'Recurrent, unexpected panic attacks with intense fear and physical symptoms lasting 15–30 minutes.',
    definition:'Panic Disorder involves repeated, unexpected panic attacks — sudden episodes of intense fear or discomfort reaching a peak within minutes — followed by persistent concern about future attacks or significant changes in behaviour to avoid perceived triggers.',
    explanation:`A panic attack is a discrete episode of intense fear characterised by rapid onset of physical and psychological symptoms. They can occur unexpectedly without any clear trigger, or may be associated with specific situations such as public speaking, driving, or crowded places.

During a panic attack, symptoms include cold sweats, dizziness, rapid heartbeat (palpitations), difficulty breathing, chest pain, and an overwhelming sense of inescapable doom — the feeling of "I might die right now." Attacks typically last 15–30 minutes but can occasionally persist for up to an hour.

The unpredictability of panic attacks creates anticipatory anxiety — the person becomes anxious about when the next attack will occur. This leads to avoidance behaviours: the person may begin avoiding malls, public meetings, driving, or other situations where they fear losing control or being unable to escape.

This avoidance can progressively restrict the person's life and may develop into agoraphobia — the fear of situations from which escape might be difficult.`,
    keyPoints:[
      'Panic attacks — sudden, intense fear reaching a peak within minutes',
      'Attacks occur unpredictably or in specific situations',
      'Duration: typically 15–30 minutes',
      'Anticipatory anxiety — fear of the next attack',
      'May lead to avoidance behaviours and agoraphobia'
    ],
    types:['Unexpected (uncued) panic attacks','Situationally-predisposed panic attacks','Nocturnal panic attacks'],
    symptoms:['Cold sweats and dizziness','Rapid heartbeat (palpitations)','Difficulty breathing','Chest pain or discomfort','Feeling of inescapable doom ("I might die")','Depersonalisation or derealisation'],
    psychologists:['Taylor (2010) — Research on panic disorder triggers','David Clark — Cognitive model of panic disorder'],
    examples:['Person having a panic attack while driving and avoiding all long journeys thereafter','A student experiencing panic attacks before presentations, eventually refusing to attend class'],
    treatment:'CBT (specifically interoceptive exposure) is highly effective. Breathing retraining, cognitive restructuring, and SSRIs/SNRIs are also standard treatments.',
    summary:'Panic Disorder involves recurrent unexpected panic attacks followed by persistent worry about future attacks. The unpredictability of attacks drives avoidance behaviours that progressively restrict the person\'s daily life. CBT and medications are highly effective treatments.',
    mnemonic:'PANIC = Palpitations · Apprehension · Numbness/sweating · Intense fear · Chest pain'
  },
  {
    id:'phobias',
    name:'Phobic Disorders',
    category:'Anxiety Disorders',
    icon:'😱',
    preview:'Irrational, excessive fear of specific objects or situations that causes significant distress and avoidance.',
    definition:'A phobia is a persistent, excessive, and irrational fear of a specific object, activity, or situation that causes significant distress and leads the person to actively avoid the feared stimulus, interfering with normal functioning.',
    explanation:`Phobic disorders become clinical when the fear causes significant distress or impairs daily functioning. Simple fears that do not impact daily life are not considered phobias. Phobias typically begin in childhood; mild ones often fade, but severe phobias can persist into adulthood.

Specific Phobia involves excessive, irrational fear of a particular object or situation — such as dogs, snakes, heights (acrophobia), closed spaces (claustrophobia), or blood. The person recognises the fear is irrational but is unable to control it.

Social Phobia (Social Anxiety Disorder) involves extreme shyness and fear of being observed, scrutinised, or negatively evaluated by others. It includes fear of public speaking, eating in public, writing in front of others, or using public restrooms. People may self-medicate with alcohol to reduce anxiety.

Agoraphobia involves intense anxiety in situations where escape might be difficult — such as crowded places, public transport, markets, or open spaces. It can lead to the person becoming virtually housebound.

Unusual phobias include Coulrophobia (clowns), Gamophobia (marriage), Mysophobia (germs), and Topophobia (performing on stage).`,
    keyPoints:[
      'Three major types: Specific Phobia, Social Phobia, Agoraphobia',
      'Fear must be excessive, persistent, and cause significant impairment',
      'Person recognises the fear is irrational but cannot control it',
      'Avoidance behaviours reinforce and maintain the phobia over time',
      'Exposure therapy is the most effective treatment'
    ],
    types:['Specific Phobia — objects or situations','Social Phobia — fear of negative evaluation','Agoraphobia — fear of crowded/inescapable situations'],
    symptoms:['Immediate anxiety response to feared stimulus','Avoidance of feared object or situation','Recognition that fear is excessive','Significant impairment in daily functioning'],
    psychologists:['Watson & Rayner (1920) — Little Albert experiment (classical conditioning of fear)','Joseph Wolpe — Developed systematic desensitisation for phobias'],
    examples:['A person who cannot ride public transport because of agoraphobia','Social phobic student avoiding presentations despite academic consequences'],
    treatment:'Exposure therapy (systematic desensitisation or flooding) is the gold standard. Cognitive restructuring and virtual reality exposure are increasingly used. Beta-blockers may help for performance anxiety.',
    summary:'Phobic disorders involve excessive, irrational fear leading to avoidance that significantly impairs functioning. The three main types are Specific Phobia, Social Phobia, and Agoraphobia. Exposure-based therapies are highly effective and produce lasting results.',
    mnemonic:'SSA Phobias = Specific · Social · Agoraphobia'
  },
  {
    id:'ocd',
    name:'Obsessive-Compulsive Disorder (OCD)',
    category:'Anxiety Disorders',
    icon:'🔄',
    preview:'Intrusive obsessions driving repetitive compulsions that temporarily relieve anxiety in a self-reinforcing cycle.',
    definition:'OCD is a mental health condition characterised by recurring, unwanted obsessions (intrusive thoughts) that generate anxiety, and compulsions (repetitive behaviours) performed to neutralise that anxiety, causing significant distress and interfering with daily functioning.',
    explanation:`Obsessions are intrusive, unwanted, repetitive thoughts, images, or urges that cause significant anxiety. Common obsessions include contamination fears ("If I touch this, I will get sick"), harm fears ("Did I leave the stove on? What if the house burns?"), superstitious beliefs, and perfectionist needs for order and symmetry.

Compulsions are repetitive behaviours or mental acts the person feels driven to perform in response to an obsession, following rigid rules. The compulsion temporarily reduces anxiety, but this relief reinforces the cycle — the anxiety returns, driving another compulsion.

An analogy: imagine a song stuck in your head — annoying but temporary. Now imagine the same thought returning hundreds of times a day, and feeling compelled to snap your fingers each time to stop it. This reflects the intrusive-relief cycle in OCD.

Types of compulsive behaviour include: Hoarders (collecting items excessively), Repeaters (performing actions a set number of times, e.g., checking the lock 15 times), Orderers (arranging objects in a perfectly specific way), and Checkers (repeatedly checking appliances, doors, switches). OCD rituals can consume hours each day.`,
    keyPoints:[
      'Obsessions — intrusive, unwanted thoughts causing anxiety',
      'Compulsions — repetitive behaviours to neutralise the anxiety',
      'Relief from compulsions is temporary — reinforcing the cycle',
      'Common obsessions: contamination, harm, order, superstition',
      'Common compulsions: checking, cleaning, ordering, counting'
    ],
    types:['Contamination OCD','Harm OCD','Symmetry/order OCD','Hoarding OCD','Intrusive thought OCD'],
    symptoms:['Time-consuming rituals (>1 hour/day)','Insight into irrationality (usually)','Significant distress and interference','Rituals providing temporary relief','Shame and exhaustion from rituals'],
    psychologists:['Paul Salkovskis — Cognitive model of OCD','Edna Foa — Developed Exposure and Response Prevention (ERP)'],
    examples:['Washing hands 30 times after touching a doorknob to prevent contamination fear','Checking the gas stove every 5 minutes before leaving the house'],
    treatment:'Exposure and Response Prevention (ERP) is the gold standard CBT approach. SSRIs (e.g., fluoxetine) are also effective. Combining ERP with medication yields the best outcomes.',
    summary:'OCD involves a self-reinforcing cycle of obsessions and compulsions. Obsessions generate anxiety; compulsions temporarily relieve it; the relief reinforces the cycle. ERP therapy — confronting feared stimuli without engaging in the compulsion — is the most effective treatment.',
    mnemonic:'OCD Cycle: Obsession → Anxiety → Compulsion → Temporary Relief → Obsession returns'
  },
  {
    id:'ptsd',
    name:'Post-Traumatic Stress Disorder (PTSD)',
    category:'Anxiety Disorders',
    icon:'⚡',
    preview:'Severe anxiety disorder following traumatic events, characterised by flashbacks, avoidance, and hyperarousal.',
    definition:'PTSD is a severe anxiety disorder that develops after direct or witnessed exposure to a traumatic event, characterised by intrusive re-experiencing, persistent avoidance, negative changes in cognition and mood, and heightened arousal lasting more than one month.',
    explanation:`PTSD can develop after experiencing or witnessing events such as physical or sexual assault, war and terrorism, natural disasters, plane crashes, or large-scale violence. It can also develop from extensive exposure to traumatic details — for example, first responders who regularly encounter victims of violence.

Re-experiencing symptoms include flashbacks (vivid reliving of the traumatic event), disturbing nightmares, and intrusive thoughts. These can feel as real and terrifying as the original trauma.

Avoidance behaviours involve deliberately avoiding places, people, activities, or thoughts associated with the trauma. Emotional numbing and social withdrawal are common.

Hyperarousal symptoms include intense fear, exaggerated startle response, irritability, difficulty sleeping, and sudden mood swings. These reflect a persistent state of physiological alertness — the nervous system remains in "threat mode."

Additional effects include depression, difficulty concentrating, poor academic or work performance, and self-medication with drugs or alcohol to manage overwhelming symptoms.`,
    keyPoints:[
      'Develops after experiencing or witnessing a traumatic event',
      'Four symptom clusters: Re-experiencing, Avoidance, Negative cognitions/mood, Hyperarousal',
      'Flashbacks — vivid, intrusive reliving of the traumatic event',
      'Avoidance of reminders of the trauma (places, people, thoughts)',
      'Risk groups: soldiers, first responders, assault survivors, disaster victims'
    ],
    types:['Acute PTSD (1–3 months post-trauma)','Chronic PTSD (>3 months)','Delayed-onset PTSD (>6 months after event)','Complex PTSD (repeated/prolonged trauma)'],
    symptoms:['Flashbacks and nightmares','Emotional numbing and withdrawal','Hypervigilance and startle response','Irritability and mood swings','Sleep disturbance','Depression and concentration problems'],
    psychologists:['Judith Herman — Trauma and Recovery (Complex PTSD)','Bessel van der Kolk — "The Body Keeps the Score"'],
    examples:['A soldier returning from war who cannot stop reliving battle scenes and avoids crowded places','Rahul (case study) — 19-year-old with depression, social withdrawal, and suicidal ideation after academic failure'],
    treatment:'Trauma-Focused CBT, EMDR (Eye Movement Desensitisation and Reprocessing), and SSRIs are evidence-based treatments. Social support and safety are essential foundations.',
    summary:'PTSD is a severe, complex disorder that can follow any traumatic experience. Its four core symptom clusters significantly impair daily functioning. Early intervention with trauma-focused CBT or EMDR dramatically improves outcomes and reduces the risk of chronicity.',
    mnemonic:'PTSD symptoms: RAH = Re-experiencing · Avoidance · Hyperarousal'
  },
  {
    id:'major-depression',
    name:'Major Depressive Disorder',
    category:'Mood Disorders',
    icon:'😢',
    preview:'Intense, persistent sadness and hopelessness that severely impairs daily functioning for at least two weeks.',
    definition:'Major Depressive Disorder (MDD) is a mood disorder characterised by at least one major depressive episode — persistent depressed mood or loss of interest/pleasure for at least two weeks, accompanied by symptoms that significantly impair daily functioning.',
    explanation:`Major depression involves intense and unrealistic sadness along with deep feelings of worthlessness. Common symptoms include decreased energy, loss of interest in everyday activities, poor appetite or changes in eating, feelings of inadequacy, frequent crying, and a pessimistic or hopeless outlook.

Severity varies considerably. Some individuals manage daily tasks despite moderate symptoms, while others experience such severe symptoms that functioning at work, home, or socially becomes nearly impossible. In extreme cases, even getting out of bed is overwhelming, sometimes requiring hospitalisation.

Women are approximately 70% more likely than men to develop major depression. Biological explanations include hormonal fluctuations and brain imaging evidence showing that depression-related brain regions are eight times larger in women. Social explanations include the greater burden of household work, childcare, and multiple role demands experienced by many women. Women are also more likely to ruminate — to dwell on and replay problems repeatedly — which intensifies depressive episodes.

More than 50% of individuals who have one episode of major depression experience another within two years, making relapse prevention an important component of long-term management.`,
    keyPoints:[
      'Persistent depressed mood or loss of pleasure for ≥2 weeks (DSM-5)',
      'Women are 70% more likely than men to develop MDD',
      'Biological causes: genetics, neurotransmitter imbalance, brain structure',
      'Cognitive causes: negative thinking patterns and rumination',
      'Over 50% experience recurrence within 2 years of first episode'
    ],
    types:['Mild MDD','Moderate MDD','Severe MDD (with or without psychotic features)','MDD with seasonal pattern (SAD)','MDD with peripartum onset'],
    symptoms:['Persistent sadness, emptiness, or hopelessness','Loss of interest in previously enjoyed activities','Fatigue and decreased energy','Changes in appetite and weight','Sleep disturbances (insomnia or hypersomnia)','Feelings of worthlessness or excessive guilt','Difficulty concentrating','Recurrent thoughts of death or suicide'],
    psychologists:['Aaron Beck — Cognitive model of depression','Martin Seligman — Learned helplessness theory','Freud — Mourning and melancholia'],
    examples:['Lisa (case study) — depression following loss of both parents and work stress','A person unable to leave their bed for days, neglecting personal hygiene and relationships'],
    treatment:'CBT is highly effective, particularly behavioural activation. Antidepressants (SSRIs) are first-line medications. Combination therapy (CBT + medication) often produces the best outcomes.',
    summary:'Major Depressive Disorder involves persistent, debilitating sadness and loss of interest that impairs all areas of daily life. It is more common in women due to biological and social factors. Cognitive and biological causes interact. CBT and antidepressants are the most effective treatments.',
    mnemonic:'SIGECAPS = Sleep · Interest · Guilt · Energy · Concentration · Appetite · Psychomotor · Suicide (MDD symptom checklist)'
  },
  {
    id:'dysthymia',
    name:'Dysthymic Disorder (Persistent Depressive Disorder)',
    category:'Mood Disorders',
    icon:'☁️',
    preview:'Chronic, mild depression lasting at least two years that colours everyday experience without fully disabling the person.',
    definition:'Dysthymic Disorder, now called Persistent Depressive Disorder (PDD), is a chronic, mild form of depression in which the person experiences low mood for most of the day, more days than not, for at least two years, accompanied by additional symptoms but without the full severity of a major depressive episode.',
    explanation:`Unlike major depression, dysthymia does not fully disable a person. However, it prevents individuals from feeling genuinely good or experiencing consistent joy. People describe feeling chronically "blue," tired, low in self-esteem, and pessimistic — as if life is always slightly grey.

A helpful analogy is Eeyore from Winnie the Pooh — constantly gloomy, low-energy, and pessimistic, but still functioning. People with dysthymia often adapt to the mood as their "normal baseline" and may not realise they are experiencing a disorder.

Symptoms include chronic sadness, low energy, low self-esteem, pessimism, and difficulty feeling joy. Because the symptoms are mild but persistent, many people do not seek treatment — often believing that "this is just how I am."

For a diagnosis, symptoms must be present most of the time for at least two years (Gureje, 2011). It is possible to experience a major depressive episode on top of dysthymia — known as "double depression."`,
    keyPoints:[
      'Chronic mild depression lasting ≥2 years',
      'Does not fully disable, but prevents feeling genuinely good',
      'Often goes unrecognised — person adapts to it as their "baseline"',
      'Symptoms: low mood, low energy, low self-esteem, pessimism',
      '"Double depression" = major depressive episode on top of dysthymia'
    ],
    types:['Persistent Depressive Disorder (early onset, before 21)','Persistent Depressive Disorder (late onset, after 21)','With atypical features','With anxious distress'],
    symptoms:['Chronic low mood','Low energy and fatigue','Low self-esteem','Pessimistic or hopeless outlook','Poor concentration','Difficulty making decisions','Decreased appetite or overeating'],
    psychologists:['Gureje (2011) — Research on dysthymia duration and diagnosis','James Kocsis — Research on chronic depression treatment'],
    examples:['Eeyore from Winnie the Pooh — constant gloom without severe crisis','A person who has felt "not quite right" for years, never experiencing genuine joy but still going to work'],
    treatment:'Psychotherapy (CBT, interpersonal therapy) and antidepressants are both effective. Combined treatment is particularly recommended for chronic depression. Treatment takes longer than for acute depression.',
    summary:'Dysthymia is a chronic, low-grade depression that persists for at least two years. Though not as severe as MDD, it significantly reduces quality of life and is often under-recognised. Early identification and treatment — through CBT and antidepressants — can substantially improve functioning.',
    mnemonic:'Dysthymia = "Dys" (bad) + "thymos" (mood) — bad mood that lasts at least 2 years'
  },
  {
    id:'sad',
    name:'Seasonal Affective Disorder (SAD)',
    category:'Mood Disorders',
    icon:'❄️',
    preview:'Seasonal pattern of depression typically emerging in winter when sunlight exposure decreases.',
    definition:'Seasonal Affective Disorder (SAD) is a form of major depression or bipolar disorder with a seasonal pattern, most commonly characterised by recurring depression during winter months when daylight hours are reduced, and remission in spring/summer.',
    explanation:`SAD is recognised as a distinct specifier of depression that follows a seasonal pattern. Symptoms worsen when sunlight exposure decreases, typically beginning in autumn and lifting in spring. Some individuals experience summer-onset SAD, though this is less common.

Possible causes include genetic susceptibility (over two-thirds of people with SAD have a relative with a mood disorder), disruption of the body's circadian rhythm by reduced sunlight, and overproduction of melatonin. The pineal gland releases melatonin in darkness, causing drowsiness and lethargy. Long winter nights may lead to melatonin overproduction in vulnerable individuals.

Reduced sunlight also affects serotonin production — a neurotransmitter closely associated with mood regulation. Lower serotonin levels during winter months may contribute directly to depressed mood.

Light therapy (phototherapy) is one of the most effective treatments for SAD. Patients sit daily in front of a sun-box containing powerful fluorescent lights that mimic natural daylight, which helps suppress melatonin, reset circadian rhythms, and improve mood.`,
    keyPoints:[
      'Depression with seasonal pattern — most common in winter',
      'Caused by reduced sunlight → altered melatonin and serotonin production',
      'Disruption of circadian rhythms contributes to symptoms',
      'Light therapy (phototherapy) is a highly effective treatment',
      'Strong genetic component — over 2/3 have a relative with mood disorder'
    ],
    types:['Winter-onset SAD (most common)','Summer-onset SAD (rarer)','Subsyndromal SAD (winter blues)'],
    symptoms:['Low energy and lethargy in winter','Increased sleep and appetite','Depressed mood','Social withdrawal','Difficulty concentrating','Weight gain (carbohydrate cravings)'],
    psychologists:['Norman Rosenthal — First described and named SAD in 1984','Alfred Lewy — Research on melatonin and SAD'],
    examples:['A person who becomes severely depressed every November and recovers by March','Students whose academic performance drops significantly during winter terms'],
    treatment:'Light therapy is first-line. SSRIs (particularly bupropion) and CBT are also effective. Increasing outdoor exposure and exercise during winter months helps reduce symptoms.',
    summary:'SAD is depression with a seasonal pattern, most commonly triggered by reduced winter sunlight. It involves disrupted melatonin and serotonin production affecting circadian rhythms. Light therapy is uniquely effective and should be combined with CBT and/or antidepressants for optimal outcomes.',
    mnemonic:'SAD = Seasonal Affective Disorder — "Sun Away, Depressed"'
  },
  {
    id:'bipolar',
    name:'Bipolar Disorder',
    category:'Mood Disorders',
    icon:'⚡',
    preview:'Extreme mood swings alternating between mania (highs) and severe depression (lows).',
    definition:'Bipolar Disorder is a mood disorder characterised by episodes of mania (or hypomania) — periods of elevated, expansive, or irritable mood with increased energy — alternating with episodes of major depression, causing significant impairment in functioning.',
    explanation:`Bipolar disorder is characterised by extreme mood swings between mania and severe depression. During a manic phase, individuals experience intense euphoria and excitement, increased social activity, excessive talkativeness, little or no sleep, and reckless behaviours such as overspending, aggression, or hypersexual behaviour. These behaviours often damage relationships, finances, and self-esteem.

Following the manic phase, individuals experience a crash into deep depression, characterised by hopelessness, despair, low energy, and difficulty functioning. This rapid shift is what makes bipolar disorder so distinctly different from major depression alone.

Bipolar disorder is three times less common than major depression and occurs equally in men and women (unlike major depression which is more common in women). It typically appears before age 30 and is more strongly heritable than major depression — first-degree relatives of people with bipolar disorder have a significantly elevated risk.

Being married reduces the risk of major depression, but offers no protective effect against bipolar disorder. Bipolar episodes are typically briefer and more frequent than major depressive episodes.`,
    keyPoints:[
      'Two poles: Mania (elevated mood, high energy) and Depression (low mood, low energy)',
      'Mania includes euphoria, reduced sleep, excessive talkativeness, and reckless behaviour',
      'Depression phase: hopelessness, despair, low energy, impaired functioning',
      'Onset usually before age 30; more strongly heritable than major depression',
      'Bipolar I includes full manic episodes; Bipolar II involves hypomania'
    ],
    types:['Bipolar I — full manic + depressive episodes','Bipolar II — hypomanic + depressive episodes','Cyclothymic Disorder — milder mood swings','Bipolar NOS — not otherwise specified'],
    symptoms:['Manic: euphoria, decreased need for sleep, grandiosity, talkativeness, recklessness','Depressive: hopelessness, despair, fatigue, suicidal ideation'],
    psychologists:['Kay Redfield Jamison — Personal account and research on bipolar disorder','Emil Kraepelin — First described "manic-depressive insanity"'],
    examples:['A person who spends all their savings during a manic episode, then cannot get out of bed for weeks','A student who stays up 4 nights writing a "brilliant novel" (mania) then crashes into severe depression'],
    treatment:'Mood stabilisers (lithium, valproate) are the foundation. Atypical antipsychotics and CBT are added for depression and relapse prevention. Psychoeducation is essential for managing triggers.',
    summary:'Bipolar disorder involves dramatic swings between mania and depression. Manic episodes produce elevated mood, reduced need for sleep, and reckless behaviour, followed by severe depressive crashes. Mood stabilisers, psychotherapy, and psychoeducation form the core of effective management.',
    mnemonic:'Bipolar: Two POLES — Mania (ELEVATED) → Depression (CRASHED)'
  },
  {
    id:'suicide',
    name:'Suicide: Causes, Warning Signs & Prevention',
    category:'Mood Disorders',
    icon:'🆘',
    preview:'Understanding suicide risk factors, psychological motives, warning signs, and evidence-based prevention strategies.',
    definition:'Suicide is the act of intentionally causing one\'s own death. Most individuals who attempt suicide are not seeking death but relief from intense psychological pain — a phenomenon described as "psychological tunnel vision."',
    explanation:`Suicide is more common than many people realise — in the United States, approximately 34,000 suicides occur per year, with one suicide every 5 minutes. There is 1 completed suicide for every 25 attempts, and suicide outranks HIV/AIDS deaths by 3:1.

Gender differences are significant: women attempt suicide twice as often as men, but men die by suicide four times more often. Men are more likely to use violent means (firearms), while women more commonly use pills or poison, allowing more opportunity for rescue. Men account for approximately 80% of all completed suicides.

Over 90% of suicide attempts involve a diagnosable mental disorder — most commonly major depression, bipolar disorder, substance abuse, PTSD, eating disorders, or schizophrenia. Low serotonin levels, linked to mood regulation and impulse control, have been found in suicide victims.

Psychological motives include escape from emotional pain, guilt or shame, turning anger inward, punishing others through guilt, or acting impulsively during a crisis. Tunnel vision — the belief that suicide is the only solution — characterises the cognitive state: temporary problems are seen as permanent, and no alternative is visible.

Warning signs include statements like "Life is pointless," social withdrawal, giving away possessions, sudden calmness after a period of depression, and preoccupation with death themes.`,
    keyPoints:[
      'More common than homicide; nearly twice as many suicides as murders',
      'Men die by suicide 4× more often; women attempt 2× more often',
      'Over 90% of attempts involve a diagnosed mental disorder',
      'Psychological tunnel vision: temporary problems seen as permanent',
      'Prevention: crisis hotlines, gun control, counselling, community support'
    ],
    types:['Suicidal ideation (thoughts of death/self-harm)','Suicidal attempts (non-fatal self-harm with intent to die)','Completed suicide','Parasuicide (self-harm without intent to die)'],
    symptoms:['Verbal cues: "I want to die," "Life is pointless"','Withdrawal from friends and family','Giving away valued possessions','Sudden calmness after a period of depression','Preoccupation with death or violence','Increased substance use'],
    psychologists:['Edwin Shneidman — "Psychache" theory of suicidal pain','Karl Menninger — Research on self-destructive behaviour','Emile Durkheim — Sociological theory of suicide (anomic, egoistic, altruistic)'],
    examples:['Rahul (19, case study) — academic failure, withdrawal, insomnia, suicidal ideation — CBT + antidepressants led to recovery','A person suddenly calm and organised after weeks of severe depression (paradoxical calmness = increased risk)'],
    treatment:'Crisis intervention, CBT, antidepressant medication, and strong social support networks are the most effective interventions. Community and environmental strategies (gun control, bridge barriers) are also evidence-based.',
    summary:'Suicide reflects unbearable psychological pain rather than a desire for death. Risk is highest in those with mental disorders, social isolation, and access to lethal means. Warning signs are identifiable and early intervention saves lives. Prevention requires individual, community, and environmental strategies working together.',
    mnemonic:'IS PATH WARM — Ideation · Substance abuse · Purposelessness · Anxiety · Trapped · Hopelessness · Withdrawal · Anger · Recklessness · Mood changes'
  },
  {
    id:'anorexia',
    name:'Anorexia Nervosa',
    category:'Eating Disorders',
    icon:'🍃',
    preview:'Severe restriction of food intake driven by intense fear of weight gain and a profoundly distorted body image.',
    definition:'Anorexia Nervosa is a serious eating disorder characterised by severe restriction of food intake, intense fear of gaining weight, and a profoundly distorted body image — perceiving oneself as overweight despite being dangerously underweight.',
    explanation:`Anorexia nervosa involves a complex interplay of psychological, biological, and social factors. The core features include dramatic weight loss (body weight ≤85% of normal), an extreme fear of gaining weight even when already dangerously underweight, and a distorted body image where patients see themselves as "fat" despite evidence to the contrary.

Physical methods of weight control include extreme calorie restriction, excessive exercise, and use of laxatives or diuretics. In women, a key clinical sign is amenorrhoea — the cessation of menstrual periods due to insufficient body fat.

Anorexia affects approximately 1% of the population, with the highest prevalence among adolescent girls and young women. It has the highest mortality rate of any mental disorder — up to 20% of those with severe anorexia die from complications, including cardiac arrest, organ failure, and suicide.

The disorder is maintained by a complex cycle: restriction → weight loss → temporary sense of control and pride → reinforcement of restriction. Cognitive distortions ("If I eat one biscuit, I will lose all control") and perfectionism play central roles. Cultural pressures — particularly media ideals of thinness — are important contributing factors.`,
    keyPoints:[
      'Body weight ≤85% of normal; intense fear of weight gain',
      'Distorted body image — sees self as overweight despite extreme thinness',
      'Amenorrhoea (loss of menstrual periods) in women',
      'Highest mortality rate of any mental disorder (up to 20%)',
      'Primarily affects adolescent girls and young women (~1% prevalence)'
    ],
    types:['Restricting type (dieting, fasting, excessive exercise)','Binge-eating/purging type (restricts but also binge-purges)'],
    symptoms:['Extreme weight loss','Distorted body image','Amenorrhoea','Excessive exercise','Use of laxatives/diuretics','Denial of hunger or illness','Obsessive food rituals'],
    psychologists:['Hilde Bruch — Foundational psychoanalytic theory of anorexia','Christopher Fairburn — Transdiagnostic CBT model for eating disorders'],
    examples:['A 16-year-old girl who weighs 38kg but insists she is "still too fat" and refuses all meals','A college student who exercises for 4 hours daily despite being hospitalised for cardiac arrhythmia'],
    treatment:'Medical stabilisation is first. Specialist eating disorder CBT, family-based treatment (Maudsley approach), and nutritional rehabilitation are evidence-based. Hospitalisation may be required when weight is dangerously low.',
    summary:'Anorexia nervosa is a severe, potentially fatal eating disorder involving extreme food restriction, weight loss, distorted body image, and intense fear of weight gain. It has the highest mortality of any mental disorder. Treatment requires medical stabilisation followed by specialist psychological and nutritional support.',
    mnemonic:'Anorexia AFRAID = Amenorrhoea · Fear of weight gain · Restriction · Altered body image · Intense perfectionism · Denial of illness'
  },
  {
    id:'bulimia',
    name:'Bulimia Nervosa',
    category:'Eating Disorders',
    icon:'🔁',
    preview:'Cycles of binge eating followed by purging behaviours, driven by intense guilt, shame, and fear of weight gain.',
    definition:'Bulimia Nervosa is an eating disorder characterised by recurrent episodes of binge eating — consuming large amounts of food in a short time with a sense of loss of control — followed by compensatory purging behaviours to prevent weight gain, accompanied by significant distress and self-criticism.',
    explanation:`Unlike anorexia, people with bulimia are usually at or near normal body weight, making the disorder less visually obvious. The core feature is the binge-purge cycle: the person eats an unusually large amount of food in a short time, feels unable to stop, and then uses compensatory behaviours to prevent weight gain.

Compensatory behaviours include self-induced vomiting, misuse of laxatives or diuretics, fasting, and excessive exercise. The person is typically aware that their behaviour is abnormal and experiences intense guilt, shame, and self-criticism after episodes, followed by a depressed mood.

During a binge, the person experiences a sense of loss of control — feeling unable to stop eating even when physically full. Episodes are typically secretive and may be triggered by stress, negative emotions, or strict dieting (which paradoxically increases bingeing).

Bulimia is more prevalent than anorexia, affecting approximately 3% of women and less than 1% of men. It is particularly common among college-age women. Medical complications of purging include dental erosion (from stomach acid), electrolyte imbalances, oesophageal damage, and irregular heartbeat (arrhythmia).`,
    keyPoints:[
      'Binge-purge cycle: large amounts of food → compensatory purging',
      'Usually at normal or near-normal body weight (unlike anorexia)',
      'Person is aware the behaviour is abnormal (unlike some other disorders)',
      'Intense guilt, shame, and self-criticism after binges',
      'Medical risks: dental erosion, electrolyte imbalances, cardiac arrhythmia'
    ],
    types:['Purging type (vomiting, laxatives, diuretics)','Non-purging type (fasting, excessive exercise)'],
    symptoms:['Recurrent binge episodes','Purging: vomiting, laxative use, excessive exercise','Sense of loss of control during binges','Intense guilt and shame after binges','Preoccupation with body weight and shape','Depression and low self-esteem'],
    psychologists:['Gerald Russell — First described bulimia nervosa as a syndrome (1979)','Christopher Fairburn — Developed CBT-Enhanced (CBT-E) for bulimia'],
    examples:['A college student who binges on large quantities of food while alone, then vomits to "undo" it','A person who fasts strictly Monday–Thursday, then binges uncontrollably on weekends'],
    treatment:'CBT-Enhanced (CBT-E) is the gold standard. SSRIs (particularly fluoxetine) reduce bingeing. Nutritional counselling and interpersonal therapy are also effective.',
    summary:'Bulimia involves recurrent binge-purge cycles driven by loss of control, intense guilt, and fear of weight gain. People with bulimia are usually of normal weight, making detection harder. CBT-E and SSRIs are the most effective treatments, with relapse prevention being an important goal.',
    mnemonic:'BULIMIA = Binge · Uncontrollable eating · Loss of control · Intense shame · Medical complications · Identity and body image distortion · After-binge purging'
  },
  {
    id:'binge-eating',
    name:'Binge Eating Disorder (BED)',
    category:'Eating Disorders',
    icon:'🍔',
    preview:'Recurrent episodes of consuming large amounts of food rapidly, without compensatory purging, causing significant distress.',
    definition:'Binge Eating Disorder (BED) is characterised by recurrent episodes of eating unusually large amounts of food in a short time with a sense of loss of control, without subsequent purging or compensatory behaviours, causing significant distress.',
    explanation:`BED is the most common eating disorder. Unlike bulimia, individuals with BED do not purge after binges — they feel extreme distress about the binging but do not attempt to compensate through vomiting, laxatives, or excessive exercise.

Binge episodes are associated with eating much more rapidly than normal, eating until uncomfortably full, eating large amounts when not physically hungry, eating alone due to embarrassment, and feeling disgusted, depressed, or guilty after the episode.

Episodes are often triggered by negative emotional states — stress, boredom, loneliness, or emotional distress. The food temporarily soothes the emotion, but guilt and shame follow immediately, reinforcing the emotional distress and setting up the next binge.

Approximately one-third of people in weight-control programmes report binge eating. BED is associated with significant health consequences including obesity, type 2 diabetes, cardiovascular disease, sleep disorders, and depression. It affects men and women more equally than other eating disorders.`,
    keyPoints:[
      'Most common eating disorder — no purging (unlike bulimia)',
      'Episodes: eating large amounts rapidly, feeling loss of control',
      'Triggered by emotional distress (stress, boredom, loneliness)',
      'Distress but no compensatory behaviours after episodes',
      'Associated with obesity, depression, and multiple medical complications'
    ],
    types:['Mild BED (1–3 episodes/week)','Moderate BED (4–7 episodes/week)','Severe BED (8–13 episodes/week)','Extreme BED (≥14 episodes/week)'],
    symptoms:['Eating unusually large amounts rapidly','Eating past fullness','Eating when not hungry','Eating alone due to shame','Feeling disgusted, depressed, or guilty after bingeing'],
    psychologists:['Michael de Zwaan — Research on BED prevalence and treatment','Carlos Grilo — CBT and pharmacological treatment research for BED'],
    examples:['A person who eats three family-size packets of crisps and several bars of chocolate in 30 minutes after a difficult day at work','A student who eats compulsively during exam stress and stops only when physically sick'],
    treatment:'CBT is the most effective psychological treatment. Lisdexamfetamine (Vyvanse) is the only FDA-approved medication for BED. Interpersonal therapy and mindfulness-based eating awareness training are also effective.',
    summary:'BED involves recurrent, distressing binge eating episodes without compensatory purging. It is the most common eating disorder and significantly increases risk of obesity and depression. CBT and mindfulness-based approaches effectively reduce binge frequency and improve emotional regulation.',
    mnemonic:'BED = Binge Episodes Daily (without purging) — emotional eating without compensation'
  },
  {
    id:'antisocial',
    name:'Antisocial Personality Disorder (ASPD)',
    category:'Personality Disorders',
    icon:'🎭',
    preview:'Persistent pattern of disregarding and violating the rights of others, lack of empathy and remorse.',
    definition:'Antisocial Personality Disorder (ASPD) is characterised by a pervasive pattern of disregard for, and violation of, the rights of others, beginning in childhood or early adolescence and continuing into adulthood, along with a lack of remorse for harmful behaviour.',
    explanation:`ASPD was formerly known as psychopathy or sociopathy, though these terms are now used more specifically. The core features include a callous disregard for others\' rights, exploitation and manipulation of others, impulsivity, irresponsibility, and deceitfulness — persistent lying and cheating without guilt.

Importantly, not all individuals with ASPD are criminals. Many are charming, intelligent, and socially skilled, using these qualities to manipulate others for personal gain. The outward charm and confidence often mask profound difficulties with genuine connection and empathy.

The disorder is frequently linked to childhood histories of abuse, neglect, or inconsistent parenting. Some researchers argue that Western cultural values — extreme individualism, competitiveness, and material success — may inadvertently reinforce certain antisocial traits.

ASPD is diagnosed only in adults (18+), though a history of Conduct Disorder before age 15 is required. It is significantly more common in men than women and in prison populations compared to the general public.`,
    keyPoints:[
      'Persistent disregard for and violation of others\' rights',
      'Lack of remorse or empathy for harmful behaviour',
      'Charm and intelligence often used to manipulate others',
      'Linked to childhood abuse, neglect, and inconsistent parenting',
      'Requires evidence of Conduct Disorder before age 15 for diagnosis'
    ],
    types:['Primary psychopathy (emotionally callous, low anxiety)','Secondary psychopathy (emotionally reactive, high anxiety)','Dissocial personality (ICD-11 equivalent)'],
    symptoms:['Repeated violations of social norms and laws','Deceitfulness and manipulation','Impulsivity and failure to plan ahead','Irritability and aggressiveness','Irresponsibility (work, finances, relationships)','Lack of remorse'],
    psychologists:['Robert Hare — Developed the Psychopathy Checklist (PCL-R)','Hervey Cleckley — "The Mask of Sanity" — classic description of psychopathy'],
    examples:['A charming individual who consistently lies and manipulates colleagues for personal advancement without guilt','A person with ASPD who commits repeated crimes, blames victims, and shows no remorse despite consequences'],
    treatment:'ASPD is notoriously difficult to treat. Cognitive-behavioural approaches targeting thinking errors and schema therapy show some promise. Treatment motivation is usually low. Focus on harm reduction and risk management.',
    summary:'ASPD involves persistent exploitation, deceit, and disregard for others\' rights, with a notable absence of empathy or remorse. Many individuals are charming but manipulative. It is linked to childhood adversity. Treatment is challenging; CBT and schema therapy are the most promising approaches.',
    mnemonic:'ASPD MICE = Manipulation · Irresponsibility · Callousness · Exploitation · (no) remorse'
  },
  {
    id:'borderline',
    name:'Borderline Personality Disorder (BPD)',
    category:'Personality Disorders',
    icon:'🌪️',
    preview:'Unstable self-image, intense relationships, emotional dysregulation, and fear of abandonment.',
    definition:'Borderline Personality Disorder (BPD) is characterised by pervasive instability in self-image, intense and unstable interpersonal relationships, emotional dysregulation, and marked impulsivity, often driven by an intense fear of real or imagined abandonment.',
    explanation:`The core of BPD is an unstable sense of self and intense emotional reactivity. Individuals may experience their relationships as intensely idealised ("My therapist is the only person who understands me") and then rapidly shift to devaluing them ("They don't care about me at all") — a pattern called "splitting" or black-and-white thinking.

Emotional instability means that people with BPD can experience rapid and intense mood shifts — feeling joyful one moment and devastated the next. These shifts are often triggered by interpersonal events, particularly anything perceived as rejection or abandonment.

Impulsive behaviours — including self-harm, suicidal threats or attempts, reckless driving, substance use, or binge eating — are often attempts to regulate overwhelming emotional pain. Self-harm is frequently used as a way to feel "something real" or to temporarily reduce emotional numbness.

BPD is associated with severe strain on relationships and high demands for attention and support. The intense fear of abandonment can paradoxically drive away the people the person depends on. BPD is diagnosed more commonly in women but affects men in similar proportions.`,
    keyPoints:[
      'Unstable self-image — chronic feelings of emptiness and identity confusion',
      'Intense, unstable relationships — rapid idealization and devaluation ("splitting")',
      'Emotional dysregulation — intense, rapidly shifting moods',
      'Fear of abandonment — frantic efforts to avoid real or imagined rejection',
      'DBT (Dialectical Behaviour Therapy) is the gold standard treatment'
    ],
    types:['BPD with emotional dysregulation predominance','BPD with identity disturbance predominance','BPD with impulsive behaviour predominance','BPD with interpersonal disturbance predominance'],
    symptoms:['Fear of abandonment','Unstable and intense relationships','Unstable self-image or sense of self','Impulsivity in ≥2 potentially self-damaging areas','Suicidal behaviour or self-harm','Severe mood swings','Chronic feelings of emptiness','Anger dysregulation','Paranoid ideation or dissociation'],
    psychologists:['Marsha Linehan — Developed Dialectical Behaviour Therapy (DBT)','John Gunderson — Foundational research on BPD diagnosis and treatment'],
    examples:['A person who texts their therapist 50 times in a day when feeling abandoned, then threatens self-harm if not answered','A student who views a new friend as "perfect" for two weeks, then considers them "pure evil" after one disagreement'],
    treatment:'DBT is the most evidence-based treatment. It teaches distress tolerance, emotion regulation, interpersonal effectiveness, and mindfulness. Mood stabilisers and antidepressants may help specific symptoms.',
    summary:'BPD involves a pervasive pattern of instability in self-image, relationships, and emotions, driven by an intense fear of abandonment. DBT, developed by Marsha Linehan — herself living with BPD — is the gold standard treatment, significantly reducing self-harm, hospitalisations, and suicidal behaviour.',
    mnemonic:'BPD FINDS = Fear of abandonment · Identity instability · Need for relationships · Dysregulation · Splitting · self-harm'
  },
  {
    id:'schizophrenia',
    name:'Schizophrenia',
    category:'Psychotic Disorders',
    icon:'🌀',
    preview:'Severe psychotic disorder with hallucinations, delusions, disorganised thinking, and social withdrawal.',
    definition:'Schizophrenia is a severe, chronic psychotic disorder characterised by significant disturbances in thought, perception, emotion, and behaviour, including hallucinations, delusions, disorganised speech, and impaired social functioning.',
    explanation:`Schizophrenia is a group of psychotic disorders characterised by severe disorganisation of thoughts, perceptions, and emotions. It is often popularly associated with the idea of "going crazy," though this is an oversimplification that contributes to stigma.

Positive symptoms (psychotic symptoms) include hallucinations — most commonly hearing voices (auditory hallucinations) commenting on behaviour or giving commands — and delusions, which are false, fixed beliefs held despite contrary evidence (e.g., believing one is being persecuted, or has special powers).

Negative symptoms involve diminishment of normal functions: flat affect (reduced emotional expression), alogia (poverty of speech), avolition (reduced motivation and initiative), anhedonia (inability to experience pleasure), and social withdrawal.

Disorganised symptoms include confused or incoherent speech, bizarre behaviour, and impaired self-care. These make daily functioning extremely challenging.

Schizophrenia typically begins in late adolescence or early adulthood, with men showing earlier onset (late teens–early 20s) than women (mid-to-late 20s). Biological factors including genetic vulnerability, dopamine dysregulation, and structural brain differences are strongly implicated. Psychosocial stressors trigger onset in genetically vulnerable individuals (diathesis-stress model).`,
    keyPoints:[
      'Positive symptoms: hallucinations (especially auditory) and delusions',
      'Negative symptoms: flat affect, alogia, avolition, anhedonia, social withdrawal',
      'Disorganised symptoms: incoherent speech, bizarre behaviour',
      'Onset in late adolescence/early adulthood; men earlier than women',
      'Dopamine dysregulation is the primary biological mechanism'
    ],
    types:['Paranoid schizophrenia (delusions of persecution)','Disorganised schizophrenia (incoherent speech/behaviour)','Catatonic schizophrenia (motor disturbances)','Residual schizophrenia (attenuated symptoms)'],
    symptoms:['Auditory hallucinations (hearing voices)','Persecutory or grandiose delusions','Disorganised and incoherent speech','Catatonia or bizarre behaviour','Flat affect and emotional blunting','Social withdrawal and impaired self-care'],
    psychologists:['Eugen Bleuler — Coined the term "schizophrenia" (1911)','E. Fuller Torrey — Research on neurobiology of schizophrenia','Aaron Beck — CBT adapted for schizophrenia'],
    examples:['A person who hears voices telling them the government is monitoring them and begins to systematically avoid all public places','A student who stops attending university, becomes mute, and no longer recognises family members during a first psychotic episode'],
    treatment:'Antipsychotic medications (first and second generation) are the primary treatment. CBT for psychosis (CBTp) improves insight and coping. Social skills training and supported employment improve functional outcomes. Family psychoeducation reduces relapse.',
    summary:'Schizophrenia is a severe psychotic disorder involving disruptions in thought, perception, and behaviour. Positive symptoms (hallucinations, delusions) and negative symptoms (flat affect, withdrawal) both require treatment. Antipsychotics plus psychosocial rehabilitation offer the best outcomes.',
    mnemonic:'Schizophrenia: HAPPY and FLAT = Hallucinations · Abnormal thoughts/delusions · Paranoia · Poverty of speech · Yelps (disorganised) AND Flat affect · Lack of motivation · Alogia · Thought disorder'
  }
];

// ─── FLASHCARD DECKS (accurate, educational) ──────────────────────────────────
const FLASHCARD_DECKS = {
  all: null, // built dynamically
  'psych-disorders': [
    { term:'What is a psychological disorder?', def:'A clinically significant pattern of thoughts, feelings, or behaviours that causes distress, dysfunction, deviance, or danger. It is NOT simply "abnormal" behaviour.', ex:'Lisa: grief-induced depression that caused work absenteeism and inability to function.', keyPoints:['Must cause significant distress or impairment','Defined by the Four Ds','Diagnosed using DSM-5'] },
    { term:'The Four Ds of psychological disorder', def:'Distress (emotional suffering), Dysfunction (impaired daily life), Deviance (outside social norms), Danger (risk to self/others). Multiple criteria needed for diagnosis.', ex:'Distress: panic attacks. Dysfunction: unable to work. Deviance: bizarre beliefs. Danger: suicidal ideation.', keyPoints:['Distress — subjective suffering','Dysfunction — impaired role performance','Deviance — context-dependent','Danger — least common criterion'] },
    { term:'What is the DSM-5?', def:'The Diagnostic and Statistical Manual of Mental Disorders (5th edition), published by the American Psychiatric Association. It is the primary classification system for diagnosing 200+ psychological disorders.', ex:'A clinician uses DSM-5 criteria to diagnose OCD when intrusive thoughts + compulsions exceed 1 hour/day.', keyPoints:['Published by APA (2013)','Symptom-focused, not cause-focused','Person-first language to reduce stigma','Updated as science and society evolve'] },
  ],
  'gad': [
    { term:'Define Generalised Anxiety Disorder', def:'Persistent, excessive, uncontrollable worry about multiple life areas for ≥6 months, causing significant distress or impairment, with associated physical symptoms.', ex:'Constantly worrying that family members are in danger, even when everything is fine, accompanied by headaches and muscle tension.', keyPoints:['≥6 months duration','"Free-floating" — no specific trigger','Physical symptoms prominent','Highly comorbid with depression'] },
    { term:'Physical symptoms of GAD', def:'Headaches, muscular tension, indigestion, fatigue, restlessness, fidgeting, and strained facial expressions. These are caused by the physiological arousal of chronic anxiety.', ex:'A student with GAD develops daily migraines, persistent muscle stiffness, and digestive problems due to chronic worry.', keyPoints:['Autonomic nervous system overactivation','Chronic stress hormones (cortisol) cause physical damage','Symptoms distinguish GAD from normal worry'] },
  ],
  'ocd': [
    { term:'OCD: Obsessions vs Compulsions', def:'Obsessions are intrusive, unwanted, repetitive thoughts that cause anxiety. Compulsions are repetitive behaviours performed to temporarily reduce that anxiety. The relief reinforces the cycle.', ex:'Obsession: "I might be contaminated." Compulsion: Washing hands 30 times. Relief: Temporary. Cycle repeats.', keyPoints:['Obsessions = intrusive thoughts (cognitive)','Compulsions = repetitive behaviours (behavioural)','Relief is temporary — reinforcing the cycle','Insight is usually intact (knows it is irrational)'] },
    { term:'Types of OCD compulsions', def:'Hoarders (excessive collecting), Repeaters (actions a set number of times), Orderers (arranging objects perfectly), Checkers (repeatedly checking appliances/locks).', ex:'A Checker rechecks the gas stove 15 times before leaving the house every morning, making them chronically late.', keyPoints:['Rituals can consume hours daily','Cause significant shame and exhaustion','Reinforced by temporary anxiety reduction','ERP therapy directly targets compulsions'] },
  ],
  'major-depression': [
    { term:'DSM-5 criteria for Major Depression', def:'≥5 symptoms for ≥2 weeks, including depressed mood OR loss of interest, plus symptoms from SIGECAPS (Sleep, Interest, Guilt, Energy, Concentration, Appetite, Psychomotor, Suicide thoughts).', ex:'A person sleeping 16 hours/day, unable to experience pleasure, feeling worthless, and unable to concentrate for 3 weeks.', keyPoints:['Must include depressed mood OR loss of interest','≥2 weeks duration required','Must cause clinically significant impairment','Most common mood disorder worldwide'] },
    { term:'Gender differences in depression', def:'Women are 70% more likely than men to develop major depression, due to hormonal differences, larger depression-related brain regions, greater role burden (work + childcare), and tendency to ruminate.', ex:'A working mother juggling career, childcare, and household management develops depression partly due to chronic role overload and rumination.', keyPoints:['Women 70% more likely than men','Hormonal, biological, and social factors','Rumination amplifies depressive episodes','Men more likely to externalise (substance use)'] },
  ],
  'bipolar': [
    { term:'Bipolar Disorder: Mania vs Depression', def:'Mania: euphoria, reduced sleep, talkativeness, grandiosity, reckless behaviour. Depression: hopelessness, despair, low energy, suicidal ideation. Episodes alternate, causing significant impairment.', ex:'A person spends their life savings during a 4-day manic episode with no sleep, then crashes into 3 weeks of severe depression.', keyPoints:['Bipolar I: full mania + depression','Bipolar II: hypomania + depression','Lithium is the gold standard mood stabiliser','Onset typically before age 30'] },
  ],
  'anorexia': [
    { term:'Anorexia Nervosa: Diagnostic Features', def:'Body weight ≤85% of normal, intense fear of gaining weight, distorted body image (sees self as fat despite extreme thinness), amenorrhoea in women.', ex:'A 17-year-old girl weighing 37kg who insists she needs to lose more weight and refuses all food, believing she is "fat."', keyPoints:['Highest mortality of any mental disorder (up to 20%)','Patient denies severity of illness','Family-based treatment (Maudsley) effective in adolescents','Medical stabilisation before psychological treatment'] },
  ],
  'schizophrenia': [
    { term:'Positive and Negative Symptoms of Schizophrenia', def:'Positive symptoms (excesses): hallucinations, delusions, disorganised speech/behaviour. Negative symptoms (deficits): flat affect, alogia, avolition, anhedonia, social withdrawal.', ex:'Positive: hearing commanding voices. Negative: unable to initiate conversations, emotionally flat, unable to feel pleasure.', keyPoints:['Positive = added phenomena (not "good")','Negative = reduced normal functions (not "bad emotions")','Antipsychotics target positive symptoms most effectively','Negative symptoms respond less to medication'] },
    { term:'Hallucinations in Schizophrenia', def:'False sensory perceptions without external stimulus. Most common in schizophrenia: auditory (hearing voices) that may comment on behaviour, converse with each other, or give commands.', ex:'A person with schizophrenia hears a voice constantly criticising their every action and commanding them not to leave the house.', keyPoints:['Auditory hallucinations most common','Voices may seem more real than actual reality','Can cause extreme distress and fear','CBT for psychosis helps challenge and manage hallucinations'] },
  ],
};

// ─── QUIZ BANK ────────────────────────────────────────────────────────────────
const QUIZ_BANK = {
  fillBlanks:[
    {q:'Fear of social situations is called _____ phobia.',          a:'social',     hint:'Social anxiety'},
    {q:'Extreme mood swings occur in _____ disorder.',               a:'bipolar',    hint:'Mania + depression'},
    {q:'CBT stands for Cognitive _____ Therapy.',                    a:'Behavioral', hint:'Modifying behaviour'},
    {q:'The psychoanalytic approach was developed by _____.',        a:'Freud',      hint:'Austrian neurologist'},
    {q:'Chronic mild depression lasting ≥2 years is called _____.',  a:'dysthymia',  hint:'Persistent depressive disorder'},
    {q:'The DSM is published by the American _____ Association.',    a:'Psychiatric',hint:'Mental health professional body'},
    {q:'Hearing voices not present in reality is called _____.',     a:'hallucination',hint:'False sensory perception'},
    {q:'False beliefs not based in reality are called _____.',       a:'delusions',  hint:'False fixed beliefs'},
    {q:'Repetitive behaviours to reduce anxiety are called _____.',  a:'compulsions',hint:'OCD rituals'},
    {q:'Seasonal depression is clinically known as _____.',          a:'SAD',        hint:'Seasonal Affective Disorder'},
    {q:'Projection of feelings onto the therapist is called _____.',a:'transference',hint:'Psychoanalytic concept'},
    {q:'Negative social attitudes toward mental illness are known as _____.',a:'stigma',hint:'Barrier to treatment'},
    {q:'Semen-loss syndrome in South Asia is called _____ syndrome.',a:'dhat',       hint:'Culture-bound syndrome'},
    {q:'PTSD can be triggered by _____ events or witnessing trauma.',a:'traumatic',  hint:'War, assault, disasters'},
    {q:'The Four Ds of abnormality are Distress, Dysfunction, Deviance, and _____.',a:'Danger',hint:'Risk to self/others'},
  ],
  mcq:[
    {q:'Which symptom cluster distinguishes OCD from generalised anxiety?',opts:['Persistent worry','Intrusive obsessions and compulsions','Panic attacks','Social avoidance'],correct:1,exp:'OCD is defined by intrusive obsessions (thoughts) and compulsions (rituals). GAD involves generalised worry without compulsions.'},
    {q:'Anorexia nervosa has the highest _____ of any mental disorder.',opts:['Prevalence rate','Comorbidity rate','Mortality rate','Treatment success rate'],correct:2,exp:'Anorexia has up to a 20% mortality rate — the highest of any psychological disorder — due to medical complications and suicide.'},
    {q:'DBT (Dialectical Behaviour Therapy) was developed specifically for:',opts:['Schizophrenia','OCD','Borderline Personality Disorder','Panic Disorder'],correct:2,exp:'Marsha Linehan developed DBT specifically for BPD, integrating acceptance and change strategies. She herself lived with BPD.'},
    {q:'In SAD, reduced sunlight causes overproduction of which hormone?',opts:['Serotonin','Cortisol','Melatonin','Dopamine'],correct:2,exp:'Reduced sunlight leads to overproduction of melatonin by the pineal gland, causing drowsiness, lethargy, and depressed mood characteristic of SAD.'},
    {q:'Culture-bound syndrome Hikikomori is associated with:',opts:['Central America — frenzy episodes','Japan — extreme social withdrawal','South Asia — semen-loss fears','North America — ancestor visions'],correct:1,exp:'Hikikomori occurs mainly in Japan, where individuals isolate in their rooms for months/years due to intense academic and social pressures.'},
    {q:'In suicide: women _____ more often; men _____ more often.',opts:['Complete/Attempt','Ideate/Attempt','Attempt/Complete','Ideate/Complete'],correct:2,exp:'Women attempt suicide twice as often; men die by suicide 4x more often due to using more lethal means (firearms vs pills).'},
    {q:'Positive symptoms of schizophrenia include:',opts:['Flat affect and avolition','Alogia and anhedonia','Hallucinations and delusions','Social withdrawal and poverty of speech'],correct:2,exp:'Positive symptoms are "added" phenomena absent in healthy people: hallucinations (false perceptions) and delusions (false beliefs). Negative symptoms are deficits in normal functioning.'},
    {q:'The Four Ds for defining psychological disorders are Distress, Dysfunction, Deviance, and:',opts:['Depression','Disorder','Danger','Diagnosis'],correct:2,exp:'Danger — the risk the behaviour poses to self or others — is the fourth D. It is the least common criterion and not required for all diagnoses.'},
  ],
};

// ─── EXAM DATA ────────────────────────────────────────────────────────────────
const EXAM_DATA = {
  subject:'Psychology of Adjustment', time:'1 Hour', total:30,
  q1:{label:'Fill in the Blanks (1 mark each)',marks:15,items:[
    {q:'Fear of social situations is called _____ phobia.',a:'social'},
    {q:'Extreme mood swings occur in _____ disorder.',a:'bipolar'},
    {q:'Hearing voices not present in reality is called _____.',a:'hallucination'},
    {q:'False beliefs not based in reality are called _____.',a:'delusions'},
    {q:'CBT stands for Cognitive _____ Therapy.',a:'Behavioral'},
    {q:'The psychoanalytic approach was developed by _____.',a:'Sigmund Freud'},
    {q:'Chronic mild depression lasting at least 2 years is called _____.',a:'dysthymia'},
    {q:'Repetitive behaviours performed to reduce anxiety are called _____.',a:'compulsions'},
    {q:'The DSM is published by the American _____ Association.',a:'Psychiatric'},
    {q:'Projection of feelings onto the therapist is called _____.',a:'transference'},
    {q:'Seasonal depression is clinically known as _____.',a:'Seasonal Affective Disorder'},
    {q:'A severe eating disorder involving extreme weight loss is _____ nervosa.',a:'anorexia'},
    {q:'Sudden intense episodes of overwhelming fear are called _____ attacks.',a:'panic'},
    {q:'Negative social attitudes toward mental illness are known as _____.',a:'stigma'},
    {q:'The use of rewards to reinforce desired behaviour in therapy is called _____ economy.',a:'token'},
  ]},
  q2:{label:'Long Answer Questions (Attempt ANY ONE)',marks:15,
    A:'Explain the major anxiety disorders with special reference to Generalised Anxiety Disorder (GAD) and Obsessive-Compulsive Disorder (OCD). Discuss their symptoms, diagnostic criteria, causes, and treatment approaches.',
    B:'Discuss suicide as a psychological concern. Explain its causes (biological, psychological, and social), warning signs, and evidence-based prevention strategies with suitable examples.',
    hints:['Define each disorder clearly using DSM-5 criteria','Discuss biological, psychological, and sociocultural causes','Include key psychologists and theoretical models','Explain at least two evidence-based treatment approaches','Support your answer with real-world or clinical examples']
  },
  q3:{label:'Short Notes (Attempt ANY THREE — 5 marks each)',marks:15,topics:[
    {t:'Psychoanalysis and its Techniques',pts:['Founded by Sigmund Freud — emphasis on the unconscious','Free association: patient says whatever comes to mind','Dream analysis: interpreting unconscious desires from dreams','Transference: patient projects feelings onto therapist','Catharsis: release of repressed emotion → therapeutic insight']},
    {t:'Person-Centred Therapy (Carl Rogers)',pts:['Humanistic approach — client knows best','Unconditional positive regard: accepting without judgement','Empathy: understanding client\'s frame of reference','Congruence: therapist is genuine and transparent','Goal: self-actualisation and personal growth']},
    {t:'Eating Disorders',pts:['Anorexia: restriction, distorted body image, ≤85% body weight, high mortality','Bulimia: binge-purge cycle, normal weight, intense guilt','Binge Eating Disorder: bingeing without purging, most common eating disorder','Biopsychosocial causes: genetics, culture, media, low self-esteem','Treatment: CBT-E, family-based therapy, nutritional rehabilitation, SSRIs']},
    {t:'Personality Disorders',pts:['Antisocial PD: disregard for others, no remorse, manipulation, impulsivity','Borderline PD: emotional instability, fear of abandonment, self-harm, splitting','Rigid, maladaptive patterns beginning in adolescence/early adulthood','DBT (Marsha Linehan) is gold standard for BPD','ASPD difficult to treat; schema therapy shows some promise']},
    {t:'Cultural Issues in Mental Health Care',pts:['Stigma and shame are major barriers to help-seeking in India','Culture-bound syndromes: Dhat (South Asia), Koro (Southeast Asia), Grisi siknis (Central America)','Cultural beliefs shape symptom expression and interpretation','Gender differences: women more likely to seek help; men more likely to deny illness','Culturally competent care: integrate cultural beliefs into treatment']},
  ]},
};

// ─── DAILY FACTS ──────────────────────────────────────────────────────────────
const DAILY_FACTS = [
  {title:'The Four Ds',text:'Psychologists use four criteria to define abnormal behaviour: Distress, Dysfunction, Deviance, and Danger. All four together help clinicians avoid labelling unusual but harmless behaviour as a disorder.'},
  {title:'OCD Cycle',text:'In OCD, compulsions temporarily relieve the anxiety caused by obsessions — but that relief reinforces the cycle. Exposure and Response Prevention (ERP) therapy breaks this cycle by preventing the compulsion while tolerating the anxiety.'},
  {title:'Bipolar & Lithium',text:'Lithium — a naturally occurring salt — remains one of the most effective mood stabilisers for bipolar disorder, used since the 1940s. It reduces both manic and depressive episodes and lowers suicide risk by up to 80%.'},
  {title:'Hikikomori',text:'In Japan, hikikomori describes individuals who withdraw from social life for months or years. Estimated to affect over 1 million Japanese people, it reflects intense cultural pressure around academic and social performance.'},
  {title:'Suicide Paradox',text:'Paradoxically, the risk of suicide increases as severe depression begins to lift — the person now has enough energy to act on suicidal thoughts. This is why close monitoring during early antidepressant treatment is critical.'},
  {title:'Anorexia Mortality',text:'Anorexia nervosa has the highest mortality rate of any mental disorder — up to 20% of those with severe, chronic anorexia die from complications. Early intervention dramatically improves outcomes.'},
  {title:'DBT & Marsha Linehan',text:'Marsha Linehan, who developed Dialectical Behaviour Therapy (DBT) for BPD, later revealed she herself had been diagnosed with BPD. Her lived experience profoundly shaped her revolutionary treatment approach.'},
  {title:'SAD & Sunlight',text:'Seasonal Affective Disorder (SAD) is treated using a "sun-box" — 10,000 lux of artificial light for 20–30 minutes each morning. It suppresses melatonin and resets the circadian rhythm, improving mood within days.'},
  {title:'GAD vs Normal Worry',text:'Everyone worries, but people with GAD cannot "turn off" their worry. The key difference: normal worry is temporary and linked to real threats. GAD involves uncontrollable worry about multiple areas for ≥6 months.'},
  {title:'DSM-5 & Person-First Language',text:'The DSM-5 uses person-first language — "a person with schizophrenia" rather than "a schizophrenic." This shift from defining people by their illness to recognising their full humanity is a powerful anti-stigma tool.'},
];

// ─── APP STATE ─────────────────────────────────────────────────────────────────
const S = {
  currentPage: 'dashboard',
  currentTopic: null,
  studyMode: 'deep',
  studyTopicIdx: 0,
  fcCards: [],
  fcIdx: 0,
  fcFlipped: false,
  quiz: null,
  quizAnswers: {},
  quizDone: false,
  showAnswers: false,
  notesPanelOpen: true,
  progress: {},   // { topicId: true/false }
  quizCount: 0,
};

// ─── LOCALSTORAGE HELPERS ─────────────────────────────────────────────────────
function lsGet(k, def=null){ try{ const v=localStorage.getItem(k); return v!==null?JSON.parse(v):def; }catch(e){ return def; } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

function loadStoredState(){
  S.progress  = lsGet('psa_progress', {});
  S.quizCount = lsGet('psa_quizcount', 0);
  updateStatsBar();
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
function navigate(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const el = document.getElementById('pg-'+page);
  if(el) el.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.page===page);
  });
  S.currentPage = page;
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
  if(page==='notes') renderNotesPage();
  if(page==='quiz')  setupQuiz(document.getElementById('quizTopicSel')?.value||'mixed');
  if(page==='exam')  renderExam();
}

function toggleNav(){ document.getElementById('navLinks').classList.toggle('open'); }

// ─── THEME ────────────────────────────────────────────────────────────────────
function toggleTheme(){
  const dark = document.documentElement.getAttribute('data-theme')==='dark';
  document.documentElement.setAttribute('data-theme', dark?'light':'dark');
  document.getElementById('themeBtn').textContent = dark ? '🌙' : '☀️';
  lsSet('psa_theme', dark?'light':'dark');
}
function loadTheme(){
  const t=lsGet('psa_theme','light');
  document.documentElement.setAttribute('data-theme',t);
  document.getElementById('themeBtn').textContent = t==='dark'?'☀️':'🌙';
}

// ─── TOAST NOTIFICATIONS ──────────────────────────────────────────────────────
function toast(msg, type='info', duration=3000){
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className='toast '+(type==='success'?'success':type==='error'?'error':'');
  t.textContent=msg;
  c.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(20px)'; t.style.transition='all .3s'; setTimeout(()=>t.remove(),300); },duration);
}

// ─── LOADING ──────────────────────────────────────────────────────────────────
function showLoading(msg='Processing…'){ document.getElementById('loading-msg').textContent=msg; document.getElementById('loading').classList.remove('hidden'); }
function hideLoading(){ document.getElementById('loading').classList.add('hidden'); }

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function updateStatsBar(){
  const notes = lsGet('psa_notes',[]);
  const studied = Object.keys(S.progress).length;
  document.getElementById('s-topics').textContent  = KB.length;
  document.getElementById('s-notes').textContent   = notes.length;
  document.getElementById('s-studied').textContent = studied;
  document.getElementById('s-quizzes').textContent = S.quizCount;
}

// ─── DAILY FACT ───────────────────────────────────────────────────────────────
function initFact(){
  const idx=new Date().getDate()%DAILY_FACTS.length;
  const f=DAILY_FACTS[idx];
  document.getElementById('factTitle').textContent=f.title;
  document.getElementById('factText').textContent=f.text;
}

// ─── TOPIC DASHBOARD ──────────────────────────────────────────────────────────
const CAT_COLOR = {
  'Foundations':          {bg:'var(--lav-light)',  color:'var(--lav)'},
  'Anxiety Disorders':    {bg:'var(--blue-light)', color:'var(--blue)'},
  'Mood Disorders':       {bg:'var(--amber-light)',color:'var(--amber)'},
  'Eating Disorders':     {bg:'var(--mint-light)', color:'var(--mint)'},
  'Personality Disorders':{bg:'var(--pink-light)', color:'var(--pink)'},
  'Psychotic Disorders':  {bg:'rgba(139,92,246,.12)',color:'var(--violet)'},
};
const catStyle=(cat)=>CAT_COLOR[cat]||{bg:'var(--lav-light)',color:'var(--lav)'};

function initTopicGrid(){
  const categories = [...new Set(KB.map(t=>t.category))];
  const pillsEl = document.getElementById('filterPills');
  pillsEl.innerHTML = `<button class="filter-pill active" onclick="filterTopics('All',this)">All</button>`
    + categories.map(c=>`<button class="filter-pill" onclick="filterTopics('${c}',this)">${c}</button>`).join('');
  renderTopicGrid(KB);

  // Populate select menus elsewhere
  populateSelects();
}

function filterTopics(cat, btn){
  document.querySelectorAll('.filter-pill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  renderTopicGrid(cat==='All'?KB:KB.filter(t=>t.category===cat));
}

function renderTopicGrid(topics){
  const grid = document.getElementById('topicsGrid');
  grid.innerHTML = '';
  topics.forEach((topic,i)=>{
    const st=catStyle(topic.category);
    const studied=S.progress[topic.id]?true:false;
    const card=document.createElement('div');
    card.className='topic-card'; card.style.animationDelay=(i*.04)+'s';
    card.innerHTML=`
      <div class="tc-top">
        <span class="tc-icon">${topic.icon}</span>
        <span class="tc-badge" style="background:${st.bg};color:${st.color}">${topic.category}</span>
      </div>
      <div class="tc-progress"><div class="tc-progress-fill" style="width:${studied?100:0}%"></div></div>
      <div class="tc-name">${topic.name}</div>
      <div class="tc-preview">${topic.preview}</div>
      <div class="tc-actions">
        <button class="btn btn-primary" onclick="openStudyTopic('${topic.id}')">📖 Study</button>
        <button class="btn btn-ghost" onclick="openFlashcardsTopic('${topic.id}')">🃏 Cards</button>
      </div>`;
    grid.appendChild(card);
  });
}

function populateSelects(){
  const cats = [...new Set(KB.map(t=>t.category))];
  // Topic select in study page
  const sel = document.getElementById('topicSelect');
  if(sel){ sel.innerHTML = KB.map((t,i)=>`<option value="${i}">${t.name}</option>`).join(''); }
  // Flashcard topic select
  const fcSel = document.getElementById('fcTopicSelect');
  if(fcSel){
    fcSel.innerHTML = `<option value="all">— All Topics —</option>`
      + KB.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  }
  // Quiz topic select
  const qSel = document.getElementById('quizTopicSel');
  if(qSel){
    qSel.innerHTML = `<option value="mixed">Mixed Topics</option>`
      + cats.map(c=>`<option value="${c}">${c}</option>`).join('');
  }
  // Notes category filter
  const nSel = document.getElementById('notesCatFilter');
  if(nSel){
    nSel.innerHTML = `<option value="all">All Topics</option>`
      + KB.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  }
  // Modal note category
  const mnSel = document.getElementById('modalNoteCat');
  if(mnSel){
    mnSel.innerHTML = `<option value="General">General</option>`
      + KB.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  }
}

// ─── STUDY PAGE ───────────────────────────────────────────────────────────────
function openStudyTopic(id){
  const idx = KB.findIndex(t=>t.id===id);
  if(idx<0) return;
  S.studyTopicIdx = idx;
  S.currentTopic = KB[idx];
  document.getElementById('topicSelect').value = idx;
  loadStudyTopic(idx);
  navigate('study');
}

function loadStudyTopic(idx){
  idx = parseInt(idx,10);
  if(isNaN(idx)||idx<0||idx>=KB.length) return;
  S.studyTopicIdx = idx;
  S.currentTopic  = KB[idx];
  // Mark as studied
  S.progress[S.currentTopic.id]=true;
  lsSet('psa_progress',S.progress);
  updateStatsBar();
  renderStudyContent();
  loadTopicNotes(S.currentTopic.id);
}

function changeStudyTopic(dir){
  const newIdx = S.studyTopicIdx + dir;
  if(newIdx>=0 && newIdx<KB.length){
    document.getElementById('topicSelect').value = newIdx;
    loadStudyTopic(newIdx);
  }
}

function setStudyMode(mode){
  S.studyMode=mode;
  document.getElementById('tab-deep').classList.toggle('active',mode==='deep');
  document.getElementById('tab-quick').classList.toggle('active',mode==='quick');
  renderStudyContent();
}

function renderStudyContent(){
  const t=S.currentTopic; if(!t) return;
  const st=catStyle(t.category);
  const body=document.getElementById('studyContent');

  if(S.studyMode==='deep'){
    body.innerHTML=`
      <!-- Header badge -->
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:4px">
        <span style="font-size:40px">${t.icon}</span>
        <div>
          <span class="tc-badge" style="background:${st.bg};color:${st.color};font-size:11px">${t.category}</span>
          <h2 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;margin-top:4px">${t.name}</h2>
        </div>
      </div>

      <!-- Definition -->
      <div class="s-card" style="animation-delay:0s">
        <div class="s-card-title" style="color:var(--lav)">📌 Definition</div>
        <p>${t.definition}</p>
      </div>

      <!-- Explanation -->
      <div class="s-card" style="animation-delay:.05s">
        <div class="s-card-title" style="color:var(--blue)">📖 Detailed Explanation <small style="font-weight:400;color:var(--text-2)">(Exam Answer Level)</small></div>
        ${t.explanation.split('\n\n').map(p=>`<p>${p}</p>`).join('')}
      </div>

      <!-- Types & Symptoms grid -->
      <div class="s-card-2col">
        ${t.types?.length?`<div class="s-card" style="animation-delay:.1s">
          <div class="s-card-title" style="color:var(--mint)">🔀 Types / Subtypes</div>
          <ul>${t.types.map(ty=>`<li>${ty}</li>`).join('')}</ul>
        </div>`:''}
        ${t.symptoms?.length?`<div class="s-card" style="animation-delay:.12s">
          <div class="s-card-title" style="color:var(--amber)">🔍 Symptoms / Features</div>
          <ul>${t.symptoms.map(s=>`<li>${s}</li>`).join('')}</ul>
        </div>`:''}
      </div>

      <!-- Key Points -->
      <div class="s-card" style="animation-delay:.15s">
        <div class="s-card-title" style="color:var(--violet)">🔑 Key Exam Points</div>
        <div class="key-points-grid">
          ${t.keyPoints.map((kp,i)=>`<div class="kp-row"><span class="kp-num">${i+1}</span><span class="kp-text">${kp}</span></div>`).join('')}
        </div>
      </div>

      <!-- Psychologists & Examples -->
      <div class="s-card-2col">
        ${t.psychologists?.length?`<div class="s-card" style="animation-delay:.2s">
          <div class="s-card-title" style="color:var(--pink)">👨‍🔬 Key Psychologists</div>
          <ul>${t.psychologists.map(p=>`<li>${p}</li>`).join('')}</ul>
        </div>`:''}
        ${t.examples?.length?`<div class="s-card" style="animation-delay:.22s">
          <div class="s-card-title" style="color:var(--amber)">💡 Examples</div>
          <ul>${t.examples.map(ex=>`<li>${ex}</li>`).join('')}</ul>
        </div>`:''}
      </div>

      <!-- Treatment -->
      ${t.treatment?`<div class="s-card" style="animation-delay:.25s">
        <div class="s-card-title" style="color:#10B981">💊 Treatment Approaches</div>
        <p>${t.treatment}</p>
      </div>`:''}

      <!-- Summary + Mnemonic -->
      <div class="s-card s-summary-card" style="animation-delay:.28s">
        <div class="s-card-title" style="color:var(--lav)">📝 Exam-Ready Summary</div>
        <p style="font-size:15px;font-weight:500">${t.summary}</p>
        ${t.mnemonic?`<div class="mnemonic-box" style="margin-top:14px">
          <strong style="color:var(--mint)">🧩 Memory Trick: </strong><span>${t.mnemonic}</span>
        </div>`:''}
      </div>`;
  } else {
    // Quick revision
    body.innerHTML=`
      <div class="quick-def-card">
        <div class="quick-label">⚡ DEFINITION</div>
        <p>${t.definition}</p>
      </div>
      <div class="s-card">
        <div class="s-card-title">🔑 Key Points at a Glance</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:4px">
          ${t.keyPoints.map(kp=>`<div class="kp-row"><span class="kp-dot" style="width:6px;height:6px;border-radius:50%;background:var(--lav);flex-shrink:0;margin-top:8px"></span><span class="kp-text">${kp}</span></div>`).join('')}
        </div>
      </div>
      <div class="s-card s-summary-card">
        <div class="s-card-title" style="color:var(--lav)">📝 Exam Summary</div>
        <p style="font-size:15px;font-weight:500">${t.summary}</p>
        ${t.mnemonic?`<div class="mnemonic-box" style="margin-top:14px"><strong style="color:var(--mint)">🧩 </strong>${t.mnemonic}</div>`:''}
      </div>
      ${t.psychologists?.length?`<div class="s-card">
        <div class="s-card-title" style="color:var(--pink)">👨‍🔬 Key Names</div>
        <ul>${t.psychologists.map(p=>`<li>${p}</li>`).join('')}</ul>
      </div>`:''}`;
  }
}

// ─── NOTES PANEL (STUDY PAGE) ─────────────────────────────────────────────────
function toggleNotesPanel(){
  S.notesPanelOpen=!S.notesPanelOpen;
  const layout=document.querySelector('.study-layout');
  const panel=document.getElementById('notesPanel');
  const colBtn=document.getElementById('notesCollapseBtn');
  if(S.notesPanelOpen){
    layout?.classList.remove('notes-hidden');
    panel?.classList.remove('hidden');
    colBtn?.classList.add('hidden');
  }else{
    layout?.classList.add('notes-hidden');
    panel?.classList.add('hidden');
    colBtn?.classList.remove('hidden');
  }
}

function loadTopicNotes(topicId){
  const notes=lsGet('psa_notes',[]).filter(n=>n.topic===topicId);
  const list=document.getElementById('savedNotesList');
  if(!list) return;
  list.innerHTML='';
  if(!notes.length){ list.innerHTML='<div style="color:var(--text-3);font-size:12.5px;text-align:center;padding:12px">No notes for this topic yet</div>'; return; }
  notes.forEach(n=>{
    const chip=document.createElement('div');
    chip.className='saved-note-chip';
    chip.innerHTML=`<span class="note-chip-title">${n.title||'Untitled'}</span><span class="note-chip-del" onclick="deleteNote('${n.id}',event)">🗑</span>`;
    chip.onclick=(e)=>{ if(e.target.classList.contains('note-chip-del')) return; document.getElementById('noteTitle').value=n.title||''; document.getElementById('noteEditor').value=n.body||''; };
    list.appendChild(chip);
  });
}

function saveNote(){
  const title=(document.getElementById('noteTitle').value||'').trim()||'Note '+(new Date().toLocaleDateString());
  const body=(document.getElementById('noteEditor').value||'').trim();
  if(!body){ toast('Please write something before saving.','error'); return; }
  const notes=lsGet('psa_notes',[]);
  const note={id:Date.now().toString(), title, body, topic:S.currentTopic?.id||'General', topicName:S.currentTopic?.name||'General', date:new Date().toLocaleDateString('en-IN')};
  notes.unshift(note);
  lsSet('psa_notes',notes);
  loadTopicNotes(S.currentTopic?.id||'General');
  updateStatsBar();
  toast('Note saved! 💾','success');
}

function clearNoteEditor(){
  document.getElementById('noteTitle').value='';
  document.getElementById('noteEditor').value='';
}

function deleteNote(id, e){
  e?.stopPropagation();
  const notes=lsGet('psa_notes',[]).filter(n=>n.id!==id);
  lsSet('psa_notes',notes);
  if(S.currentTopic) loadTopicNotes(S.currentTopic.id);
  renderNotesPage();
  updateStatsBar();
  toast('Note deleted','info');
}

// ─── NOTES PAGE ───────────────────────────────────────────────────────────────
function renderNotesPage(){
  const notes=lsGet('psa_notes',[]);
  const grid=document.getElementById('notesGrid');
  if(!grid) return;
  if(!notes.length){ grid.innerHTML='<div class="empty-state large">No notes yet. Start studying and jot down your thoughts! 📖</div>'; return; }
  grid.innerHTML='';
  notes.forEach(n=>{
    const card=document.createElement('div');
    card.className='note-card';
    card.innerHTML=`
      <div class="note-card-header">
        <div class="note-card-title">${n.title||'Untitled'}</div>
        <span class="note-cat-badge">${n.topicName||'General'}</span>
      </div>
      <div class="note-card-body">${n.body||''}</div>
      <div class="note-card-footer">
        <span class="note-card-date">📅 ${n.date||''}</span>
        <div class="note-card-actions">
          <button class="btn btn-ghost" style="font-size:12px;padding:5px 10px" onclick="editNote('${n.id}')">✏️ Edit</button>
          <button class="btn btn-ghost" style="font-size:12px;padding:5px 10px" onclick="deleteNote('${n.id}')">🗑</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
  updateStatsBar();
}

function filterNotes(search){
  const cat=document.getElementById('notesCatFilter')?.value||'all';
  let notes=lsGet('psa_notes',[]);
  if(search) notes=notes.filter(n=>(n.title+n.body).toLowerCase().includes(search.toLowerCase()));
  if(cat!=='all') notes=notes.filter(n=>n.topic===cat);
  const grid=document.getElementById('notesGrid');
  if(!notes.length){ grid.innerHTML='<div class="empty-state">No notes match your search.</div>'; return; }
  grid.innerHTML='';
  notes.forEach(n=>{
    const card=document.createElement('div');
    card.className='note-card';
    card.innerHTML=`
      <div class="note-card-header">
        <div class="note-card-title">${n.title||'Untitled'}</div>
        <span class="note-cat-badge">${n.topicName||'General'}</span>
      </div>
      <div class="note-card-body">${n.body||''}</div>
      <div class="note-card-footer">
        <span class="note-card-date">📅 ${n.date||''}</span>
        <div class="note-card-actions">
          <button class="btn btn-ghost" style="font-size:12px;padding:5px 10px" onclick="editNote('${n.id}')">✏️ Edit</button>
          <button class="btn btn-ghost" style="font-size:12px;padding:5px 10px" onclick="deleteNote('${n.id}')">🗑</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function openNewNoteModal(){
  document.getElementById('modalTitle').textContent='New Note';
  document.getElementById('modalNoteTitle').value='';
  document.getElementById('modalNoteBody').value='';
  document.getElementById('noteModal').classList.remove('hidden');
  document.getElementById('noteModal')._editId=null;
}

function editNote(id){
  const note=lsGet('psa_notes',[]).find(n=>n.id===id);
  if(!note) return;
  document.getElementById('modalTitle').textContent='Edit Note';
  document.getElementById('modalNoteTitle').value=note.title||'';
  document.getElementById('modalNoteCat').value=note.topic||'General';
  document.getElementById('modalNoteBody').value=note.body||'';
  document.getElementById('noteModal').classList.remove('hidden');
  document.getElementById('noteModal')._editId=id;
}

function saveModalNote(){
  const title=(document.getElementById('modalNoteTitle').value||'').trim()||('Note '+new Date().toLocaleDateString());
  const body=(document.getElementById('modalNoteBody').value||'').trim();
  const topicId=document.getElementById('modalNoteCat').value;
  if(!body){ toast('Please write something.','error'); return; }
  let notes=lsGet('psa_notes',[]);
  const editId=document.getElementById('noteModal')._editId;
  const topicObj=KB.find(t=>t.id===topicId);
  if(editId){
    notes=notes.map(n=>n.id===editId?{...n,title,body,topic:topicId,topicName:topicObj?.name||topicId}:n);
    toast('Note updated! ✏️','success');
  } else {
    notes.unshift({id:Date.now().toString(),title,body,topic:topicId,topicName:topicObj?.name||topicId,date:new Date().toLocaleDateString('en-IN')});
    toast('Note saved! 💾','success');
  }
  lsSet('psa_notes',notes);
  closeNoteModal();
  renderNotesPage();
  updateStatsBar();
}

function closeNoteModal(){ document.getElementById('noteModal').classList.add('hidden'); }

// ─── FLASHCARDS ───────────────────────────────────────────────────────────────
function openFlashcardsTopic(id){
  const el=document.getElementById('fcTopicSelect');
  if(el) el.value=id;
  loadFlashcards(id);
  navigate('flashcards');
}

function loadFlashcards(topicId){
  let cards=[];
  if(topicId==='all'){
    Object.values(FLASHCARD_DECKS).forEach(deck=>{ if(deck) cards=[...cards,...deck]; });
  } else {
    cards = FLASHCARD_DECKS[topicId] || [];
    if(!cards.length){
      const topic=KB.find(t=>t.id===topicId);
      if(topic) cards=generateCardsFromTopic(topic);
    }
  }
  if(!cards.length){ toast('No flashcards available for this topic yet.','info'); return; }
  S.fcCards=cards; S.fcIdx=0; S.fcFlipped=false;
  renderCard();
}

function generateCardsFromTopic(t){
  return [
    {term:`Define: ${t.name}`, def:t.definition, ex:t.examples?.[0]||'', keyPoints:t.keyPoints.slice(0,3)},
    {term:`Key symptoms of ${t.name}`, def:(t.symptoms||[]).slice(0,4).join(' · '), ex:'', keyPoints:t.keyPoints.slice(0,3)},
    {term:`Treatment for ${t.name}`, def:t.treatment||'Psychotherapy and/or medication', ex:'', keyPoints:t.keyPoints.slice(2)},
    {term:`Key psychologist associated with ${t.name}`, def:(t.psychologists||[]).join('; '), ex:'', keyPoints:[]},
    {term:`Exam summary: ${t.name}`, def:t.summary, ex:t.mnemonic||'', keyPoints:t.keyPoints},
  ];
}

function renderCard(){
  const cards=S.fcCards; if(!cards.length) return;
  const c=cards[S.fcIdx];
  const total=cards.length;
  const pct=((S.fcIdx+1)/total*100).toFixed(0);

  document.getElementById('fcProgressFill').style.width=pct+'%';
  document.getElementById('fcCounter').textContent=`Card ${S.fcIdx+1} of ${total}`;

  // Card faces
  const cardEl=document.getElementById('fcCard');
  cardEl.classList.remove('flipped');
  S.fcFlipped=false;

  // Colour
  const colors=['#7C6BE8','#4E9AF1','#34D399','#EC4899','#F59E0B','#8B5CF6'];
  const col=colors[S.fcIdx%colors.length];
  document.getElementById('fcBack').style.background=col;

  document.getElementById('fcQNum').textContent=(S.fcIdx+1)+'/'+total;
  document.getElementById('fcTerm').textContent=c.term;
  document.getElementById('fcDef').textContent=c.def;
  document.getElementById('fcEx').textContent=c.ex?'📝 '+c.ex:'';

  // Dots
  const dots=document.getElementById('fcDots');
  dots.innerHTML='';
  const maxDots=Math.min(total,12);
  for(let i=0;i<maxDots;i++){
    const d=document.createElement('div');
    d.className='fc-dot'+(i===S.fcIdx?' active':'');
    const idx=i; d.onclick=()=>{ S.fcIdx=idx; S.fcFlipped=false; renderCard(); };
    dots.appendChild(d);
  }

  // Key points
  const kp=document.getElementById('fcKeyPoints');
  if(c.keyPoints?.length){
    kp.innerHTML=`<div class="fc-kp-title">🔑 Key Points</div><div class="fc-kp-list">`
      +c.keyPoints.map(p=>`<div class="fc-kp-item"><div class="fc-kp-dot"></div><span>${p}</span></div>`).join('')
      +`</div>`;
    kp.style.display='block';
  } else { kp.style.display='none'; }
}

function flipCard(){
  S.fcFlipped=!S.fcFlipped;
  document.getElementById('fcCard').classList.toggle('flipped',S.fcFlipped);
}
function prevCard(){ if(S.fcIdx>0){ S.fcIdx--; renderCard(); } }
function nextCard(){ if(S.fcIdx<S.fcCards.length-1){ S.fcIdx++; renderCard(); } }

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
function setupQuiz(filter='mixed'){
  S.quiz=null; S.quizAnswers={}; S.quizDone=false;
  document.getElementById('quizScoreCard').classList.add('hidden');
  document.getElementById('quizSubmitBtn').classList.remove('hidden');
  document.getElementById('quizRetryBtn').classList.add('hidden');
  document.getElementById('quiz-sub').textContent=(QUIZ_BANK.fillBlanks.length+QUIZ_BANK.mcq.length)+' questions • Test your knowledge';

  let fills=[...QUIZ_BANK.fillBlanks];
  let mcqs=[...QUIZ_BANK.mcq];
  // Shuffle
  fills.sort(()=>Math.random()-.5); mcqs.sort(()=>Math.random()-.5);
  fills=fills.slice(0,8); mcqs=mcqs.slice(0,5);

  S.quiz={fills,mcqs};
  renderQuiz();
}

function renderQuiz(){
  const {fills,mcqs}=S.quiz;
  let html=`<div class="quiz-section-hd">Section A — Fill in the Blanks</div><div class="quiz-block">`;
  fills.forEach((q,i)=>{
    html+=`<div class="q-item" id="qf-${i}">
      <div class="q-text"><b>Q${i+1}.</b> ${q.q}</div>
      <input class="q-input" id="fi-${i}" type="text" placeholder="Hint: ${q.hint}" oninput="S.quizAnswers['f'+${i}]=this.value">
      <div class="q-fb hidden" id="fb-f${i}"></div>
    </div>`;
  });
  html+=`</div><div class="quiz-section-hd" style="color:var(--lav)">Section B — Multiple Choice</div><div class="quiz-block">`;
  mcqs.forEach((q,i)=>{
    html+=`<div class="mcq-item" id="qm-${i}">
      <div class="mcq-q"><span>Q${fills.length+i+1}.</span> ${q.q}</div>
      <div class="mcq-opts">
        ${q.opts.map((o,j)=>`<button class="mcq-opt" id="mo-${i}-${j}" onclick="selectMCQ(${i},${j})">${['A','B','C','D'][j]}. ${o}</button>`).join('')}
      </div>
      <div class="mcq-exp hidden" id="mex-${i}">💡 ${q.exp}</div>
    </div>`;
  });
  html+=`</div>`;
  document.getElementById('quizBody').innerHTML=html;
  document.getElementById('quizSubmitBtn').classList.remove('hidden');
}

function selectMCQ(qi,optIdx){
  if(S.quizDone) return;
  S.quizAnswers['m'+qi]=optIdx;
  document.querySelectorAll(`#qm-${qi} .mcq-opt`).forEach((b,j)=>b.classList.toggle('selected',j===optIdx));
}

function submitQuiz(){
  if(S.quizDone) return;
  S.quizDone=true;
  const {fills,mcqs}=S.quiz;
  let correct=0,total=0;
  fills.forEach((q,i)=>{
    total++;
    const ans=(S.quizAnswers['f'+i]||'').toLowerCase().trim();
    const ok=ans===q.a.toLowerCase().trim();
    if(ok) correct++;
    const inp=document.getElementById('fi-'+i); if(inp) inp.disabled=true;
    const box=document.getElementById('qf-'+i); if(box) box.classList.add(ok?'correct':'wrong');
    const fb=document.getElementById('fb-f'+i);
    if(fb){ fb.classList.remove('hidden'); fb.className='q-fb '+(ok?'ok':'no'); fb.textContent=ok?'✓ Correct!':'✗ Answer: '+q.a; }
  });
  mcqs.forEach((q,i)=>{
    total++;
    const sel=S.quizAnswers['m'+i];
    const ok=sel===q.correct;
    if(ok) correct++;
    document.querySelectorAll(`#qm-${i} .mcq-opt`).forEach((b,j)=>{
      b.disabled=true;
      if(j===q.correct) b.classList.add('correct');
      else if(j===sel&&!ok) b.classList.add('wrong');
    });
    const ex=document.getElementById('mex-'+i); if(ex) ex.classList.remove('hidden');
  });
  const pct=Math.round(correct/total*100);
  const emoji=pct>=80?'🏆':pct>=60?'👍':pct>=40?'📖':'📚';
  const msg=pct>=80?'Excellent! You\'re exam-ready.':pct>=60?'Good effort! Review incorrect answers.':pct>=40?'Keep studying! Use Deep Study mode.':'Review all topics before retrying.';
  const sc=document.getElementById('quizScoreCard');
  sc.innerHTML=`<div class="score-emoji">${emoji}</div><div class="score-number">${correct}/${total}</div><div class="score-pct">${pct}%</div><div class="score-msg">${msg}</div>`;
  sc.classList.remove('hidden');
  document.getElementById('quizSubmitBtn').classList.add('hidden');
  document.getElementById('quizRetryBtn').classList.remove('hidden');
  S.quizCount++; lsSet('psa_quizcount',S.quizCount); updateStatsBar();
  sc.scrollIntoView({behavior:'smooth',block:'start'});
}

function resetQuiz(){ setupQuiz(document.getElementById('quizTopicSel')?.value||'mixed'); }

// ─── EXAM PAPER ───────────────────────────────────────────────────────────────
function renderExam(){
  const e=EXAM_DATA; const sa=S.showAnswers;
  let html=`
  <div class="exam-cover">
    <div class="exam-cover-tag">PRACTICE EXAMINATION PAPER</div>
    <h1>${e.subject}</h1>
    <div class="exam-meta">
      <span>⏱ Time: ${e.time}</span>
      <span>📊 Total Marks: ${e.total}</span>
      <span>All questions compulsory</span>
    </div>
  </div>
  <div class="exam-q-block">
    <div class="exam-q-head">
      <span class="exam-q-num">Q.1</span>
      <span class="marks-badge" style="background:var(--blue)">${e.q1.marks} Marks</span>
    </div>
    <div class="exam-q-sub">${e.q1.label}</div>
    ${e.q1.items.map((it,i)=>`<div class="blank-item">
      <span class="blank-num">(${i+1})</span>
      <span style="flex:1">${it.q}</span>
      ${sa?`<span class="blank-ans">→ ${it.a}</span>`:''}
    </div>`).join('')}
  </div>
  <div class="exam-q-block">
    <div class="exam-q-head">
      <span class="exam-q-num">Q.2</span>
      <span class="marks-badge" style="background:var(--lav)">${e.q2.marks} Marks</span>
    </div>
    <div class="exam-q-sub">${e.q2.label}</div>
    <div class="long-opt"><b style="color:var(--lav)">A.</b> ${e.q2.A}</div>
    <div class="exam-or">— OR —</div>
    <div class="long-opt"><b style="color:var(--blue)">B.</b> ${e.q2.B}</div>
    ${sa&&e.q2.hints?.length?`<div class="hints-box"><div class="hl">✏️ Key points to include:</div><ul>${e.q2.hints.map(h=>`<li>${h}</li>`).join('')}</ul></div>`:''}
  </div>
  <div class="exam-q-block">
    <div class="exam-q-head">
      <span class="exam-q-num">Q.3</span>
      <span class="marks-badge" style="background:var(--mint);color:#065F46">${e.q3.marks} Marks</span>
    </div>
    <div class="exam-q-sub">${e.q3.label}</div>
    ${e.q3.topics.map((sn,i)=>`<div class="sn-item">
      <b>(${i+1})</b> ${sn.t}
      ${sa&&sn.pts?.length?`<ul class="sn-pts">${sn.pts.map(p=>`<li>${p}</li>`).join('')}</ul>`:''}
    </div>`).join('')}
  </div>`;
  document.getElementById('examPaper').innerHTML=html;
}

function toggleAnswers(){
  S.showAnswers=!S.showAnswers;
  document.getElementById('toggleAnsBtn').textContent=S.showAnswers?'🙈 Hide Answers':'✅ Show Answers';
  renderExam();
}

// ─── PDF IMPORT ───────────────────────────────────────────────────────────────
async function importPDF(event){
  const file=event.target.files[0];
  if(!file || !file.name.endsWith('.pdf')){ toast('Please select a PDF file.','error'); return; }
  showLoading('📄 Reading PDF…');
  try {
    if(!window.pdfjsLib){
      toast('PDF.js not loaded. Please check your internet connection.','error');
      hideLoading();
      return;
    }
    const ab=await file.arrayBuffer();
    const pdf=await pdfjsLib.getDocument({data:ab}).promise;
    let text='';
    for(let i=1;i<=pdf.numPages;i++){
      const pg=await pdf.getPage(i);
      const ct=await pg.getTextContent();
      text+=ct.items.map(x=>x.str).join(' ')+'\n';
    }
    hideLoading();
    const wordCount=text.trim().split(/\s+/).length;
    toast(`✅ PDF imported! Extracted ~${wordCount.toLocaleString()} words. Content added to your study set.`,'success',5000);

    // Store raw text for potential future use
    const stored=lsGet('psa_imported_pdfs',[]);
    stored.push({name:file.name,text:text.slice(0,5000),date:new Date().toLocaleDateString('en-IN')});
    lsSet('psa_imported_pdfs',stored);

    event.target.value='';
  } catch(err){
    hideLoading();
    toast('Error reading PDF: '+err.message,'error');
    event.target.value='';
  }
}

// ─── NAVBAR SCROLL ────────────────────────────────────────────────────────────
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>10);
});

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  // Load PDF.js
  const s=document.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  s.onload=()=>{
    if(window.pdfjsLib)
      pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  };
  document.head.appendChild(s);

  loadTheme();
  loadStoredState();
  initFact();
  initTopicGrid();
  loadFlashcards('all');
  renderExam();

  // Initial study topic
  loadStudyTopic(0);

  // Modal close on overlay click
  document.getElementById('noteModal')?.addEventListener('click',function(e){
    if(e.target===this) closeNoteModal();
  });
});

// Expose globals
window.navigate=navigate; window.toggleNav=toggleNav; window.toggleTheme=toggleTheme;
window.filterTopics=filterTopics; window.openStudyTopic=openStudyTopic; window.openFlashcardsTopic=openFlashcardsTopic;
window.loadStudyTopic=loadStudyTopic; window.changeStudyTopic=changeStudyTopic; window.setStudyMode=setStudyMode;
window.toggleNotesPanel=toggleNotesPanel; window.saveNote=saveNote; window.clearNoteEditor=clearNoteEditor;
window.deleteNote=deleteNote; window.openNewNoteModal=openNewNoteModal; window.editNote=editNote;
window.saveModalNote=saveModalNote; window.closeNoteModal=closeNoteModal; window.filterNotes=filterNotes;
window.loadFlashcards=loadFlashcards; window.flipCard=flipCard; window.prevCard=prevCard; window.nextCard=nextCard;
window.setupQuiz=setupQuiz; window.selectMCQ=selectMCQ; window.submitQuiz=submitQuiz; window.resetQuiz=resetQuiz;
window.renderExam=renderExam; window.toggleAnswers=toggleAnswers; window.importPDF=importPDF;
window.S=S;
