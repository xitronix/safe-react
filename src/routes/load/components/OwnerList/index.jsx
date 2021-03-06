// @flow
import TableContainer from '@material-ui/core/TableContainer'
import { withStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'

import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import Identicon from '~/components/Identicon'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { FIELD_LOAD_ADDRESS, THRESHOLD } from '~/routes/load/components/fields'
import { getOwnerAddressBy, getOwnerNameBy } from '~/routes/open/components/fields'
import { border, disabled, extraSmallFontSize, lg, md, screenSm, sm } from '~/theme/variables'

const styles = () => ({
  details: {
    padding: lg,
    borderRight: `solid 1px ${border}`,
    height: '100%',
  },
  owners: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  ownerName: {
    marginBottom: '15px',
    minWidth: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      marginBottom: '0',
      minWidth: '0',
    },
  },
  ownerAddresses: {
    alignItems: 'center',
    marginLeft: `${sm}`,
  },
  address: {
    paddingLeft: '6px',
    marginRight: sm,
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  title: {
    padding: `${md} ${lg}`,
  },
  owner: {
    padding: `0 ${lg}`,
    marginBottom: '12px',
  },
  header: {
    padding: `${sm} ${lg}`,
    color: disabled,
    fontSize: extraSmallFontSize,
  },
  name: {
    marginRight: `${sm}`,
  },
})

type Props = {
  values: Object,
  classes: Object,
  updateInitialProps: (initialValues: Object) => void,
}

const calculateSafeValues = (owners: Array<string>, threshold: Number, values: Object) => {
  const initialValues = { ...values }
  for (let i = 0; i < owners.length; i += 1) {
    initialValues[getOwnerAddressBy(i)] = owners[i]
  }
  initialValues[THRESHOLD] = threshold
  return initialValues
}

const OwnerListComponent = (props: Props) => {
  const [owners, setOwners] = useState<Array<string>>([])
  const { classes, updateInitialProps, values } = props

  useEffect(() => {
    let isCurrent = true

    const fetchSafe = async () => {
      const safeAddress = values[FIELD_LOAD_ADDRESS]
      const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
      const safeOwners = await gnosisSafe.getOwners()
      const threshold = await gnosisSafe.getThreshold()

      if (isCurrent && owners) {
        const sortedOwners = safeOwners.sort()
        const initialValues = calculateSafeValues(sortedOwners, threshold, values)
        updateInitialProps(initialValues)
        setOwners(sortedOwners)
      }
    }

    fetchSafe()

    return () => {
      isCurrent = false
    }
  }, [])

  return (
    <>
      <Block className={classes.title}>
        <Paragraph color="primary" noMargin size="md">
          {`This Safe has ${owners.length} owners. Optional: Provide a name for each owner.`}
        </Paragraph>
      </Block>
      <Hairline />
      <TableContainer>
        <Row className={classes.header}>
          <Col xs={4}>NAME</Col>
          <Col xs={8}>ADDRESS</Col>
        </Row>
        <Hairline />
        <Block margin="md" padding="md">
          {owners.map((address, index) => (
            <Row className={classes.owner} key={address}>
              <Col className={classes.ownerName} xs={4}>
                <Field
                  className={classes.name}
                  component={TextField}
                  initialValue={`Owner #${index + 1}`}
                  name={getOwnerNameBy(index)}
                  placeholder="Owner Name*"
                  text="Owner Name"
                  type="text"
                  validate={required}
                />
              </Col>
              <Col xs={8}>
                <Row className={classes.ownerAddresses}>
                  <Identicon address={address} diameter={32} />
                  <Paragraph className={classes.address} color="disabled" noMargin size="md">
                    {address}
                  </Paragraph>
                  <CopyBtn content={address} />
                  <EtherscanBtn type="address" value={address} />
                </Row>
              </Col>
            </Row>
          ))}
        </Block>
      </TableContainer>
    </>
  )
}

const OwnerListPage = withStyles(styles)(OwnerListComponent)

const OwnerList = ({ updateInitialProps }: Object, network: string) => (controls: React$Node, { values }: Object) => (
  <>
    <OpenPaper controls={controls} padding={false}>
      <OwnerListPage network={network} updateInitialProps={updateInitialProps} values={values} />
    </OpenPaper>
  </>
)

export default OwnerList
