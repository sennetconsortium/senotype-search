import AppAccordion from "@/components/layout/AppAccordion";
import React from "react";
import {Descriptions} from 'antd';

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
                <>
                    {senotype.submitter.name.first} {senotype.submitter.name.last}
                    <a href={`mailto:${senotype.submitter.email}`}>{senotype.submitter.email}</a>
                </>
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
        .map(obj => obj.term);

    let celltypeChildren = senotype.assertions
        .filter(item => item.predicate?.term === "has_cell_type")
        .flatMap(item => item.objects)
        .map(obj => obj.term);

    return [
        {
            key: '1',
            label: 'Taxon',
            children: <>
                {taxonChildren.map((item, index) => (
                    <>
                        {item}
                        {index < taxonChildren.length - 1 && <br/>}
                    </>
                ))}
            </>
        },
        {
            key: '2',
            label: 'Location',
            children: <>
                {locationChildren.map((item, index) => (
                    <>
                        {item}
                        {index < locationChildren.length - 1 && <br/>}
                    </>
                ))}
            </>
        },
       {
            key: '3',
            label: 'Celltype',
            children: <>
                {celltypeChildren.map((item, index) => (
                    <>
                        {item}
                        {index < celltypeChildren.length - 1 && <br/>}
                    </>
                ))}
            </>
        },

    ]
}

export default function ViewSenotype({senotype}) {
    return (
        <>
            <AppAccordion title={'Summary'}>

                <Descriptions items={buildSummary(senotype)}/>

            </AppAccordion>

            <AppAccordion title={'Senotype'}>

                <Descriptions items={buildSenotype(senotype)}/>

            </AppAccordion>
        </>
    )
}