  //TODO: Convert to JSON
  // LINKS:
  // Const
  const map_courtURL_to_jurisdiction = {
    // Federal:
    scc: {court_url_id:"scc", jur:"ca"},
    fca: {court_url_id:"fca", jur:"ca"},
    fc: {court_url_id:"fct", jur:"ca"}, // Weird one: fc vs fct
    tcc: {court_url_id:"tcc", jur:"ca"},
    // BC:
    bcca: {court_url_id:"bcca", jur:"bc"},
    bcsc: {court_url_id:"bcsc", jur:"bc"},
    bcpc: {court_url_id:"bcpc", jur:"bc"},
    // AB:
    abca: {court_url_id:"abca", jur:"ab"},
    abqb: {court_url_id:"abqb", jur:"ab"},
    abpc: {court_url_id:"abpc", jur:"ab"},
    // SK:
    skca: {court_url_id:"skca", jur:"sk"},
    skqb: {court_url_id:"skqb", jur:"sk"},
    skpc: {court_url_id:"skpc", jur:"sk"},
    skdc: {court_url_id:"skdc", jur:"sk"}, // NOTE: 1983 CanLII 2300 (SKDC) would be an ID
    skufc: {court_url_id:"skufc", jur:"sk"}, // NOTE: 1983 CanLII 2405 (SK UFC) would be an ID
    // MB:
    mbca: {court_url_id:"mbca", jur:"mb"},
    mbqb: {court_url_id:"mbqb", jur:"mb"},
    mbpc: {court_url_id:"mbpc", jur:"mb"},
    // ON:
    onca: {court_url_id:"onca", jur:"on"},
    onsc: {court_url_id:"onsc", jur:"on"},
    onscdc: {court_url_id:"onscdc", jur:"on"}, // https://www.canlii.org/en/on/onscdc/doc/2018/2018onsc484/2018onsc484.html
    onscsm: {court_url_id:"onscsm", jur:"on"}, // Weird one
    oncj: {court_url_id:"oncj", jur:"on"},
    // QC:
    qcca: {court_url_id:"qcca", jur:"qc"},
    qccs: {court_url_id:"qccs", jur:"qc"},
    qccq: {court_url_id:"qccq", jur:"qc"},
    qctdp: {court_url_id:"qctdp", jur:"qc"},
    qctp: {court_url_id:"qctp", jur:"qc"},
    qccm: {court_url_id:"qccm", jur:"qc"}, // Weird one
    // NB:
    nbca: {court_url_id:"nbca", jur:"nb"},
    nbqb: {court_url_id:"nbqb", jur:"nb"},
    nbpc: {court_url_id:"nbpc", jur:"nb"},
    // NS:
    nsca: {court_url_id:"nsca", jur:"ns"},
    nssc: {court_url_id:"nssc", jur:"ns"},
    nssf: {court_url_id:"nssf", jur:"ns"},
    nspc: {court_url_id:"nspc", jur:"ns"},
    nssm: {court_url_id:"nssm", jur:"ns"},
    nspb: {court_url_id:"nspr", jur:"ns"}, // Weird one: nspb vs nspr
    nsfc: {court_url_id:"nsfc", jur:"ns"},
    // PE:
    peca: {court_url_id:"pescad", jur:"pe"}, // Weird one: peca vs pescad
    pesc: {court_url_id:"pesctd", jur:"pe"}, // Weird one: pesc vs pesctd
    // NL:
    nlca: {court_url_id:"nlca", jur:"nl"},
    nlsc: {court_url_id:"nlsc", jur:"nl"},
    nlpc: {court_url_id:"nlpc", jur:"nl"}, // Weird one (CanLII)
    nlma: {court_url_id:"nlma", jur:"nl"},
    // YK:
    ykca: {court_url_id:"ykca", jur:"yk"},
    yksc: {court_url_id:"yksc", jur:"yk"},
    yktc: {court_url_id:"yktc", jur:"yk"},
    yksm: {court_url_id:"yksm", jur:"yk"},
    // NT:
    nwtca: {court_url_id:"ntca", jur:"nt"}, // Weird one: nwtca vs ntca
    nwtsc: {court_url_id:"ntsc", jur:"nt"}, // Weird one: nwtsc vs ntsc
    nwttc: {court_url_id:"nttc", jur:"nt"}, // Weird one: nwttc vs nttc
    // nwttc: {court_url_id:"ntyjc", jur:"nt"}, // Weird one: nwttc vs ntyjc; NOTE: same key as previous
    // NU:
    nuca: {court_url_id:"nuca", jur:"nu"},
    nucj: {court_url_id:"nucj", jur:"nu"},
    yjcn: {court_url_id:"nuyc", jur:"nu"}, // Weird one: yjcn vs nuyc
  };