import React from "react";
import { Icon } from "components";
import filter from "lodash/filter";
import isUndefined from "lodash/isUndefined";
import { withStyles } from "@material-ui/core/styles";
import Label from "egov-ui-kit/utils/translationNode";
import { httpRequest } from "egov-ui-kit/utils/api";
import { List} from  "egov-ui-kit/components";
import Input from '@material-ui/core/Input';
import get from "lodash/get";
import queryString from 'query-string';
// import "./index.css";

const styles = (theme) => ({
  root: {
    padding: "2px 4px",
    // margin: "0px 8px"
    marginLeft:"8px",
    position: "fixed",
    top: "50px",
    height: "48px",
    zIndex: "1100",
    display: "flex",
    alignItems: "center",
    boxShadow: "0px 2px rgba(0, 0, 0, 0.23)",
    backgroundColor: "#fff",
    borderRadius: "28px",
  },
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: "16px",
  },
});
const getListItems = items =>
  items.map((item) => ({
    primaryText: (
      <Label
        label={item.label}
        fontSize="16px"
        color="#484848"
        labelStyle={{ fontWeight: 500 }}
      />
    )
  
   // route: item.route,

  }));



class WhatsAppCity extends React.Component {
  state = {
    searchText: "",
    data:[],
    citylist:[],
    cityname:"",
  };

  getMDMSData = async () => {
    let mdmsBody = { 
      
      MdmsCriteria: {
        tenantId :"pb.amritsar",
        moduleDetails: [
         {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "citymodule"
              }
            ]
          },
        ]
      }
    };
    try {
      const payload = await httpRequest(
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      return payload;
    } catch (e) {
      console.log(e);
    }
    };
  
//  fetchMDMSData = async () => {
//       const mdmsRes = await this.getMDMSData();
//       return mdmsRes;
//   }
   
 componentDidMount = async () => {
  const values = queryString.parse(this.props.location.search)
  const cityname=values.tenantId;
  this.setState({
    cityname:cityname,
  })
  console.log("cityname",cityname);
  
 const cityl=await this.getMDMSData();
 const citylistCode=   get(cityl, "MdmsRes.tenant.citymodule.0.tenants", []);
 const citylist= citylistCode.map((item) => {
  return {
     code : item.code,
     label :"TENANT_TENANTS_" + (item.code).toUpperCase().replace(/[.]/g, "_")
   }


   // route: item.route,

  })
    
  this.setState({
    citylist:citylist,
  })
  };
  
  
  
  onChangeText = (searchText,citylist, dataSource, params,) => {
    this.setState({ searchText });
    //logic to like search on items    
    const filterData = citylist.filter(item => item.label.toLowerCase().includes(searchText.toLowerCase()));
 
    
    this.setState({
      data:filterData,
    })
    if(searchText===""){
      this.setState({
        data:citylist,
      })
    }
  };

  onSearchClick = (e) => {
    this.setState({
      searchValue: e.target.value,
    });
  };

  render() {
    const { classes, history } = this.props;
    const { searchText ,citylist} = this.state;
      const {  onChangeText,getMDMSData,fetchMDMSData} = this;
  
  
    return (
        <div>
       <div className="search-background">
        <div className="header-iconText">
        <Icon id="back-navigator" action="navigation" name="arrow-back" />
        <Label
              label="Choose locality"
              color="white"
              fontSize={18}
              bold={true}
              containerStyle={{ marginLeft: 17,marginTop:-2 }}
        />

       </div>  
       
       <div className={`${classes.root} dashboard-search-main-cont`}>
        <Icon action="action" name="search" style={{ marginLeft: 12 }} />
        <Input
        placeholder="Search locality"
        disableUnderline={true}
        fullWidth={true}
        //className={classes.input}
        inputProps={{
          'aria-label': 'Description',
        }}
        onChange={(e) => {
          onChangeText(e.target.value,citylist);
       
      }}
      />
      </div>
       
       <div className="list-style">
       <List
          items={getListItems(this.state.data)}
          primaryTogglesNestedList={true}
          onItemClick={(item, index) => {
            const weblink="https://api.whatsapp.com/send?phone=919987106368&text="+item.primaryText.props.label
            window.location.href=weblink 
          
           // history && history.push(item.route);
          }}
          listItemStyle = {{borderBottom:"1px solid grey"}}
        //  listContainerStyle = {{height:"50px"}}
          
      />
    </div>
    </div>
       </div>
    );
  }
}


export default withStyles(styles)(
( WhatsAppCity )
);
