import AppAccordion from "@/components/layout/AppAccordion";
import React, {useRef, useState} from "react";
import {LinkOutlined, SearchOutlined} from '@ant-design/icons';
import {Anchor, Button, Col, Descriptions, Input, Row, Space, Table} from 'antd';
import {getMarkerDetailsUrl, getOboDetailsUrl, getSciCrunchUrl} from "@/lib/senotype";
import ClipboardCopy from "@/components/ClipboardCopy";

const buildSummary = (senotype) => {
    return [
        {
            key: '1',
            label: 'Name',
            children: senotype.senotype.name
        },
        {
            key: '2',
            label: 'Submitter',
            children: (
                <span className={'flex'}>
                    <div>{senotype.submitter.name.first} {senotype.submitter.name.last}</div>
                    <div><a href={`mailto:${senotype.submitter.email}`}>{senotype.submitter.email}</a></div>
                </span>
            )
        },
        {
            key: '3',
            label: 'Description',
            children: senotype.senotype.definition
        },

    ]
}

const buildSenotype = (senotype) => {
    let taxonChildren = senotype.assertions
        .filter(item => item.predicate?.term === "in_taxon")
        .flatMap(item => item.objects)
        .map(obj => obj.term);

    let locationChildren = senotype.assertions
        .filter(item => item.predicate?.term === "located_in")
        .flatMap(item => item.objects)
        .map(obj => ({key: obj.code, value: obj.term}));

    let celltypeChildren = senotype.assertions
        .filter(item => item.predicate?.term === "has_cell_type")
        .flatMap(item => item.objects)
        .map(obj => ({key: obj.code, value: `${obj.code} (${obj.term})`}));

    let hallmarkChildren = senotype.assertions
        .filter(item => item.predicate?.term === "has_hallmark")
        .flatMap(item => item.objects)
        .map(obj => obj.term);

    let microenvironmentChildren = senotype.assertions
        .filter(item => item.predicate?.term === "has_microenvironment")
        .flatMap(item => item.objects)
        .map(obj => obj.term);

    let inducerChildren = senotype.assertions
        .filter(item => item.predicate?.term === "has_inducer")
        .flatMap(item => item.objects)
        .map(obj => obj.term);

    let assayChildren = senotype.assertions
        .filter(item => item.predicate?.term === "has_assay")
        .flatMap(item => item.objects)
        .map(obj => obj.term);

    let diagnosisChildren = senotype.assertions
        .filter(item => item.predicate?.term === "has_diagnosis")
        .flatMap(item => item.objects)
        .map(obj => ({key: obj.code, value: obj.term}));

    let keyCounter = 4
    let items = [
        {
            key: '1',
            label: 'Taxon',
            children: <span className={'flex'}>
                        {taxonChildren.map((item, index) => (
                            <div key={`taxon_${index}`} className={'mb-1'}>
                                {item}
                            </div>
                        ))}
                    </span>
        },
        {
            key: '2',
            label: 'Location',
            children: <span className={'flex'}>
                        {locationChildren.map((item, index) => (
                            <div key={`location_${index}`} className={'mb-1'}>
                                {item.value} <a target={'_blank'}
                                                href={getOboDetailsUrl(item.key.replace(':', '_'))}>
                                <LinkOutlined/></a>
                            </div>
                        ))}
                    </span>
        },
        {
            key: '3',
            label: 'Celltype',
            children: <span className={'flex'}>
                        {celltypeChildren.map((item, index) => (
                            <div key={`celltype_${index}`} className={'mb-1'}>
                                {item.value} <a target={'_blank'}
                                                href={getOboDetailsUrl(item.key.replace(':', '_'))}>
                                <LinkOutlined/></a>
                            </div>
                        ))}
                    </span>
        },
        {
            key: '4',
            label: 'Hallmark',
            children: <span className={'flex'}>
                        {hallmarkChildren.map((item, index) => (
                            <div key={`hallmark_${index}`} className={'mb-1'}>
                                {item}
                            </div>
                        ))}
                    </span>
        }
    ];
    if (microenvironmentChildren.length > 0) {
        keyCounter++
        items.push(
            {
                key: keyCounter,
                label: 'Microenvironment',
                children: <span className={'flex'}>
                        {microenvironmentChildren.map((item, index) => (
                            <div key={`microenvironment_${index}`} className={'mb-1'}>
                                {item}
                            </div>
                        ))}
                    </span>
            }
        )
    }

    if (inducerChildren.length > 0) {
        keyCounter++
        items.push(
            {
                key: keyCounter,
                label: 'Inducer',
                children: <span className={'flex'}>
                        {inducerChildren.map((item, index) => (
                            <div key={`inducer_${index}`} className={'mb-1'}>
                                {item}
                            </div>
                        ))}
                    </span>
            }
        )
    }

    if (assayChildren.length > 0) {
        keyCounter++
        items.push(
            {
                key: keyCounter,
                label: 'Assay',
                children: <span className={'flex'}>
                        {assayChildren.map((item, index) => (
                            <div key={`assay_${index}`} className={'mb-1'}>
                                {item}
                            </div>
                        ))}
                    </span>
            }
        )
    }

    if (diagnosisChildren.length > 0) {
        keyCounter++
        items.push(
            {
                key: keyCounter,
                label: 'Diagnosis',
                children: <span className={'flex'}>
                        {diagnosisChildren.map((item, index) => (
                            <div key={`diagnosis_${index}`} className={'mb-1'}>
                                {item.value} <a target={'_blank'}
                                                href={getOboDetailsUrl(item.key.replace(':', '_'))}>
                                <LinkOutlined/></a>
                            </div>
                        ))}
                    </span>
            }
        )
    }

    return items;
}

const buildDemographic = (senotype) => {
    let keyCounter = 0
    let items = []
    let sexChildren = senotype.assertions
        .filter(item => item.predicate?.term === "has_sex")
        .flatMap(item => item.objects)
        .map(obj => obj.term);


    let ageChildren = senotype.assertions
        .filter(item => item.objects[0]?.term === "age")
        .flatMap(item => item.objects)
        .map(obj => obj.lowerbound && obj.upperbound ? `${obj.value} ${obj.unit} (range: ${obj.lowerbound}-${obj.upperbound} ${obj.unit})` : `${obj.value} ${obj.unit}`);

    let bmiChildren = senotype.assertions
        .filter(item => item.objects[0]?.term === "bmi")
        .flatMap(item => item.objects)
        .map(obj => obj.lowerbound && obj.upperbound ? `${obj.value} ${obj.unit} (range: ${obj.lowerbound}-${obj.upperbound} ${obj.unit})` : `${obj.value} ${obj.unit}`);

    console.log(sexChildren)

    if (sexChildren.length > 0) {
        keyCounter++
        items.push(
            {
                key: keyCounter,
                label: 'Sex',
                children: <span className={'flex'}>
                        {sexChildren.map((item, index) => (
                            <div key={`sex_${index}`} className={'mb-1'}>
                                {item}
                            </div>
                        ))}
                    </span>

            }
        )
    }
    if (ageChildren.length > 0) {
        keyCounter++
        items.push(
            {
                key: ageChildren,
                label: 'Age',
                children: <span className={'flex'}>
                        {ageChildren.map((item, index) => (
                            <div key={`age_${index}`} className={'mb-1'}>
                                {item}
                            </div>
                        ))}
                    </span>
            }
        )
    }

    if (bmiChildren.length > 0) {
        keyCounter++
        items.push(
            {
                key: bmiChildren,
                label: 'BMI',
                children: <span className={'flex'}>
                        {bmiChildren.map((item, index) => (
                            <div key={`bmi_${index}`} className={'mb-1'}>
                                {item}
                            </div>
                        ))}
                    </span>
            }
        )
    }

    return items;
}

const buildReferences = (senotype) => {
    let keyCounter = 0
    let items = []
    let citationChildren = senotype.assertions
        .filter(item => item.predicate?.term === "has_citation")
        .flatMap(item => item.objects)
        .map(obj => ({key: obj.code, value: `${obj.code} (${obj.term})`}));

    let originChildren = senotype.assertions
        .filter(item => item.predicate?.term === "has_origin")
        .flatMap(item => item.objects)
        .map(obj => ({key: obj.code, value: `${obj.code} (${obj.term})`}));

    let datasetChildren = senotype.assertions
        .filter(item => item.predicate?.term === "has_dataset")
        .flatMap(item => item.objects)
        .map(obj => ({key: obj.code, value: `${obj.code} (${obj.term})`}));

    if (citationChildren.length > 0) {
        keyCounter++
        items.push(
            {
                key: keyCounter,
                label: 'Citation',
                children:
                    <span className={'flex'}>
                        {citationChildren.map((item, index) => (
                            <div key={`citation_${index}`} className={'mb-2'}>
                                {item.value} <a target={'_blank'}
                                                href={process.env.NEXT_PUBLIC_PUBMED_BASE_URL + item.key.replace("PMID:", "")}>
                                <LinkOutlined/></a>
                            </div>
                        ))}
                    </span>
            }
        )
    }

    if (originChildren.length > 0) {
        keyCounter++
        items.push(
            {
                key: originChildren,
                label: 'Origin',
                children:
                    <span className={'flex'}>
                        {originChildren.map((item, index) => (
                            <div key={`origin_${index}`} className={'mb-2'}>
                                {item.value} <a target={'_blank'}
                                                href={getSciCrunchUrl(item.key)}>
                                <LinkOutlined/></a>
                            </div>
                        ))}
                    </span>
            }
        )
    }

    if (datasetChildren.length > 0) {
        keyCounter++
        items.push(
            {
                key: datasetChildren,
                label: 'Dataset',
                children:
                    <span className={'flex'}>
                        {datasetChildren.map((item, index) => (
                            <div key={`dataset_${index}`} className={'mb-2'}>
                                {item.value} <a target={'_blank'}
                                                href={`${process.env.NEXT_PUBLIC_PORTAL_URL}dataset?uuid=${item.key}`}>
                                <LinkOutlined/></a>
                            </div>
                        ))}
                    </span>
            }
        )
    }

    return items;
}

const buildMarkers = (senotype, key, markerType) => {
    return senotype.assertions
        .filter(item => item.predicate?.term === key)
        .flatMap(item => item.objects)
        .map(obj => markerType ? ({key: obj.code, marker: `${obj.code} (${obj.term})`, markerType: markerType}) : ({
            key: obj.code,
            marker: `${obj.code} (${obj.term})`
        }));
}

const markerColumns = (title, key, getColumnSearchProps, sortedInfo) => [
    {
        title: title,
        dataIndex: key,
        key: key,
        ...getColumnSearchProps(key),
        sorter: (a, b) => a.marker.localeCompare(b.marker),
        render: (_, record) =>
            <span>{record.marker} <a target={'_blank'}
                                     href={getMarkerDetailsUrl(record.key)}><LinkOutlined/></a> </span>
    }
]

export default function ViewSenotype({senotype}) {
    const [sortedInfo, setSortedInfo] = useState({});
    const searchInput = useRef(null);

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
    };
    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        confirm();
    };

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{padding: 8}} onKeyDown={e => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                        size="small"
                        style={{width: 90}}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        }
    });

    return (
        <>
            <Row>
                <Col span={20}>
                    <div className={'markdown'}>
                    <h2>{senotype.senotype.id}<ClipboardCopy text={senotype.senotype.id}
                                                             title={'Copy Senotype ID {text} to clipboard'}/></h2>
                    <Button href={`${process.env.NEXT_PUBLIC_EDITOR_URL}edit/${senotype.senotype.id}`}>Edit</Button>


                    <AppAccordion title={'Summary'} id={'summary'}>
                        <Descriptions items={buildSummary(senotype)} column={2}/>
                    </AppAccordion>

                    <AppAccordion title={'Senotype'} id={'senotype'}>
                        <Descriptions items={buildSenotype(senotype)}/>
                    </AppAccordion>

                    {buildDemographic(senotype).length > 0 &&
                        <AppAccordion title={'Demographic'} id={'demographic'}>
                            <Descriptions items={buildDemographic(senotype)}/>
                        </AppAccordion>
                    }

                    {buildReferences(senotype).length > 0 &&
                        <AppAccordion title={'References'} id={'references'}>
                            <Descriptions items={buildReferences(senotype)}/>
                        </AppAccordion>
                    }

                    <AppAccordion title={'Specified Markers'} id={'specified-markers'}>
                        <Table
                            columns={markerColumns('Specified Marker', 'specified_marker', getColumnSearchProps, sortedInfo)}
                            dataSource={buildMarkers(senotype, 'has_characterizing_marker_set')}></Table>
                    </AppAccordion>

                    <AppAccordion title={'Regulating Markers'} id={'regulating-markers'}>
                        <Table columns={[
                            ...markerColumns('Regulating Marker', 'regulating_marker', getColumnSearchProps, sortedInfo),
                            {
                                title: 'Marker Type',
                                key: 'markerType',
                                dataIndex: 'markerType',
                                sorter: (a, b) => a.markerType.localeCompare(b.markerType),
                            }
                        ]}
                               dataSource={[
                                   ...buildMarkers(senotype, 'down_regulates', 'down'),
                                   ...buildMarkers(senotype, 'up_regulates', 'up'),
                                   ...buildMarkers(senotype, 'inconclusively_regulates', '?'),
                               ]}
                               onChange={handleChange}
                        ></Table>
                    </AppAccordion>
                        </div>
                </Col>
                <Col span={1}></Col>
                <Col  span={3}>
                    <Anchor
                        items={[
                            {key: 'Summary', href: '#summary', title: 'Summary'},
                            {key: 'Senotype', href: '#senotype', title: 'Senotype'},
                            {key: 'Demographic', href: '#demographic', title: 'Demographic'},
                            {key: 'References', href: '#references', title: 'References'},
                            {key: 'Specified Markers', href: '#specified-markers', title: 'Specified Markers'},
                            {key: 'Regulating Markers', href: '#regulating-markers', title: 'Regulating Markers'}
                        ]}
                    />
                </Col>
            </Row>
        </>
    )
}