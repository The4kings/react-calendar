import React from 'react';
import './Calendar.css';

 class Calendar extends React.Component {
    
    state = {
        date : new Date(),
        showMonthPopup: false,
        showYearPopup: false,
        selectedDay: null
    }

    constructor(props) {
        super(props);
        this.width = props.width || "350px";
        this.style = props.style || {};
        this.style.width = this.width; 
    }


    weekdaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    year = () => {
        console.log(this.state.date);
        return this.state.date.getFullYear();
    }
    month = () => {
        return this.months[this.state.date.getMonth()];
    }
    daysInM = (month,year) => {          
        return new Date(year, month+1, 0).getDate();       
    }
    daysInMonth = () => { 
        return this.daysInM(this.state.date.getMonth(), this.year());        
    }
    currentDay = () => {
        return this.state.date.getDate();
    }
    firstDayOfMonth = () => {
        let firstDay =  new Date(this.year(), this.state.date.getMonth(), 1);
        return firstDay.getDay(); 
    }

    setmonth = (month) => {
        let monthNo = this.months.indexOf(month);
        return this.state.date.setMonth(monthNo);
    }

    nextMonth () {      
        const {date} = this.state;
        let date_ = date;  
        
        let a = date_.getMonth()+1; 
        date_ = date_.setMonth(a);
        this.setState({date:new Date(date_)});
        
    }

    prevMonth = () => {
        const {date} = this.state;
        let date_ = date;  
        
        let a = date_.getMonth()-1; 
        date_ = date_.setMonth(a);
        this.setState({date:new Date(date_)});
        
    }

    onSelectChange = (e, data) => {
        
        this.setmonth(data);
        this.props.onMonthChange && this.props.onMonthChange();
        

    }
    SelectList = (props) => {
        let popup = props.data.map((data) => {
            return (
                <div key={data}>
                    <a href="nothing" onClick={(e)=> {this.onSelectChange(e, data)}}>
                        {data}
                    </a>
                </div>
            );
        });

        return (
            <div className="month-popup">
                {popup}
            </div>
        );
    }

    onChangeMonth = (e, month) => {
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    }

    MonthNav = () => {
        return (
            <span className="label-month"
                onClick={(e)=> {this.onChangeMonth(e, this.month())}}>
                {this.month()}
                {this.state.showMonthPopup &&
                 <this.SelectList data={this.months} />
                }
            </span>
        );
    }

    showYearEditor = () => {
        this.setState({
            showYearNav: true
        });
    }

    setYear = (year) => {
        return this.state.date.setYear(year);
    }
    onYearChange = (e) => {
        this.setYear(e.target.value);
        this.props.onYearChange && this.props.onYearChange(e, e.target.value);
    }

    onKeyUpYear = (e) => {
        if (e.which === 13 || e.which === 27) {
            this.setYear(e.target.value);
            this.setState({
                showYearNav: false
            })
        }
    }

    YearNav = () => {
        return (
            this.state.showYearNav ?
            <input
                defaultValue = {this.year()}
                className="editor-year"
                ref={(yearInput) => { this.yearInput = yearInput}}
                onKeyUp= {(e) => this.onKeyUpYear(e)}
                onChange = {(e) => this.onYearChange(e)}
                type="number"
                placeholder="year"/>
            :
            <span
                className="label-year"
                onDoubleClick={(e)=> { this.showYearEditor()}}>
                {this.year()}
            </span>
        );
    }

    onDayClick = (e, day) => {
        this.setState({
            selectedDay: day
        }, () => {
            console.log("SELECTED DAY: ", this.state.selectedDay);
        });

        this.props.onDayClick && this.props.onDayClick(e, day);
    }

    render() {
        // Map the weekdays i.e Sun, Mon, Tue etc as <td>
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className="week-day">{day}</td>
            )
        });

        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i * 80} className="emptySlot">
                {""}
                </td>
            );
        }

        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let className = (d === this.currentDay() ? "day current-day": "day");
            let selectedClass = (d === this.state.selectedDay ? " selected-day " : "")
            if(this.state.selectedDay !== null)
            className = "day"
            daysInMonth.push(
                <td key={d} className={className + selectedClass} >
                    <span onClick={(e)=>{this.onDayClick(e, d)}}>{d}</span>
                </td>
            );
        }


        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i*100}>
                    {d}
                </tr>
            );
        })

        return (
            <div className="calendar-container" style={this.style}>
            <table className="calendar">
                <thead>
                    <tr className="calendar-header">
                    <td>
                    <i className="prev fa fa-caret-square-o-left" onClick={ (e)=> { this.prevMonth() } }>
                            </i></td>
                            
                        <td colSpan="5">
                            <this.MonthNav />
                            {" "}
                            <this.YearNav />
                        </td>
                        <td>
                            <i className="next fa fa-caret-square-o-right"
                                onClick={(e)=> {this.nextMonth()}}>
                            </i>

                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {weekdays}
                    </tr>
                    {trElems}
                </tbody>
            </table>

        </div>

    );
}
}

export default Calendar;