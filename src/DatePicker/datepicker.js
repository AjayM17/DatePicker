import React, { Component } from "react";
import './datepicker.css'

class DatePicker extends Component {
    constructor() {
        super()
        this.months = [
            { name: 'Jan' },
            { name: 'Feb' },
            { name: 'Mar' },
            { name: 'Apr' },
            { name: 'May' },
            { name: 'Jun' },
            { name: 'Jul' },
            { name: 'Aug' },
            { name: 'Sep' },
            { name: 'Oct' },
            { name: 'Nov' },
            { name: 'Dec' }
        ]
        this.weekdays = [
            { name: 'Sun' },
            { name: 'Mon' },
            { name: 'Tue' },
            { name: 'Wed' },
            { name: 'Thu' },
            { name: 'Fri' },
            { name: 'Sat' }
        ]
        this.state = {
            monthCalenderView: [],
            month: 0,
            year: 0,
            defaultDate: 0,
            defaultMonth: 0,
            defaultYear: 0,
            selectedDate: 0,
            showRemovebtn: false,
            todayDate: 0,
            todayMonth: 0,
            todayYear: 0,
            isPreMonthAvail: false,
        }
    }

    componentDidMount() {
        this.getCurrentDay()
    }

    getCurrentDay() {
        let today_date_arr = new Date().toString().split(' ')
        const month_index = this.months.findIndex(month => month.name == today_date_arr[1])
        this.setState({
            todayDate: parseInt(today_date_arr[2]),
            todayMonth: month_index,
            todayYear: parseInt(today_date_arr[3]),
        }, () => {
            this.setCurrentDay(this.props.initialDate)
        })
    }

    setCurrentDay(initialDate) {
        let defaultMonth = null, defaultYear = null, defaultDate = null, showRemovebtn = false
        if (initialDate.trim() != '') {
            let default_date_arr = initialDate.toString().split(' ')[0].split('-')
            defaultMonth = parseInt(default_date_arr[1]) - 1
            defaultYear = parseInt(default_date_arr[0])
            defaultDate = parseInt(default_date_arr[2])
            showRemovebtn = true
        } else {
            defaultMonth = this.state.todayMonth
            defaultYear = this.state.todayYear
            defaultDate = this.state.todayDate
            showRemovebtn = false
        }
        this.setState({
            defaultMonth: defaultMonth,
            defaultYear: defaultYear,
            defaultDate: defaultDate,
            month: defaultMonth,
            year: defaultYear,
            selectedDate: defaultDate,
            showRemovebtn: showRemovebtn
        }, () => {
            this.getDaysInMonth(this.state.month, this.state.year)
        })
    }

    getDaysInMonth(month, year) {
        const previous_month = new Date(year, month, 0).getDate()
        const current_month = new Date(year, month);
        const starting_day = current_month.getDay()
        const days_view_in_calender = [];
        while (current_month.getMonth() === month) {
            let temp_date = null
            if (current_month.getFullYear() == this.state.todayYear && current_month.getMonth() == this.state.todayMonth && current_month.getDate() < this.state.todayDate) {
                temp_date = { isCurrentMonthDate: false, value: current_month.getDate() }
            } else {
                temp_date = { isCurrentMonthDate: true, value: current_month.getDate() }
            }
            days_view_in_calender.push(temp_date);
            current_month.setDate(current_month.getDate() + 1);
        }
        for (let i = 0; i < starting_day; i++) {
            const temp_date = {
                isCurrentMonthDate: false,
                value: previous_month - i
            }
            days_view_in_calender.unshift(temp_date)
        }
        let tempMonthCalenderView = []
        const rows_in_month_calender_view = Math.ceil(days_view_in_calender.length / 7)
        for (let i = 0; i < rows_in_month_calender_view; i++) {
            let month_calender_row = []
            for (let j = (i * 7); j < (i * 7 + 7); j++) {
                if (j < days_view_in_calender.length) {
                    month_calender_row.push(days_view_in_calender[j])
                }
            }
            tempMonthCalenderView.push(month_calender_row)
        }
        let nextMonthValues = 1
        while (tempMonthCalenderView[tempMonthCalenderView.length - 1].length < 7) {
            const temp_date = { isCurrentMonthDate: false, value: nextMonthValues }
            tempMonthCalenderView[tempMonthCalenderView.length - 1].push(temp_date)
            nextMonthValues = nextMonthValues + 1
        }
        this.setState({
            monthCalenderView: tempMonthCalenderView
        }
            , () => { this.isPreMonthAvailable() })
    }

    getPreviousMonth() {
        let month = this.state.month, year = this.state.year
        if (this.state.month == 0) {
            month = 11
            year = year - 1
        } else {
            month = this.state.month - 1
        }
        this.setState({ month: month, year: year, selectedDate: 0 }, () => {
            this.getDaysInMonth(this.state.month, this.state.year)
        })
    }

    isPreMonthAvailable = () => {
        if (this.state.year == this.state.todayYear || this.props.enablePreviousMonth) {
            if (this.state.month > this.state.todayMonth || this.props.enablePreviousMonth) {
                this.setState({ isPreMonthAvail: true })
            } else {
                this.setState({ isPreMonthAvail: false })
            }
        } else if (this.state.year > this.state.todayYear) {
            this.setState({ isPreMonthAvail: true })
        } else {
            this.setState({ isPreMonthAvail: false })
        }
    }


    render() {
        return (<div className="datepicker-popup" onClick={(event) => { event.stopPropagation() }}>
            <div className="datepicker">
                <div className="header">
                    <span className="icon" style={this.state.isPreMonthAvail ? { opacity: 1 } : { opacity: 0.1 }} onClick={() => {
                        if (this.state.isPreMonthAvail) { this.getPreviousMonth() }
                    }}>    &lt; </span>
                    <div className="title">
                        <span > {
                            this.months[this.state.month]['name']}
                        </span>
                        <span> {this.state.year}
                        </span>
                    </div>
                    <span className="icon" onClick={() => {
                        let month = this.state.month
                        let year = this.state.year
                        if (this.state.month == 11) {
                            month = 0
                            year = year + 1
                        } else {
                            month = this.state.month + 1
                        }
                        this.setState({ month: month, year: year, selectedDate: 0 }, () => { this.getDaysInMonth(this.state.month, this.state.year) })
                    }} >&gt; </span>
                </div>
                <table>
                    <thead>
                        <tr>
                            {this.weekdays.map((weekday, index) => (<th key={index}> {weekday.name}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.monthCalenderView.map((month_date_row, index) => (
                            <tr key={'tr' + index}>
                                {
                                    month_date_row.map((date, row_index) => (
                                        date.isCurrentMonthDate ? (
                                            <td key={row_index + 'td' + index} onClick={() => {
                                                this.setState({ selectedDate: date.value })
                                            }} className={"yes " + (this.state.defaultDate == date.value && this.state.defaultMonth == this.state.month && this.state.defaultYear == this.state.year ? ('default_date') : (this.state.selectedDate == date.value ? ('selected_date') : ('')))} >{date.value}
                                            </td>
                                        ) : (
                                                <td key={row_index + 'td' + index} className="no">
                                                    {date.value}
                                                </td>
                                            )

                                    ))
                                }

                            </tr>
                        ))
                        }


                    </tbody>
                </table>
            </div>
            <div className="footer">

                <div className="buttons" onClick={() => {
                    let month = this.state.month + 1
                    if (month < 10) { month = '0' + month } let date = this.state.selectedDate
                    if (date < 10) { date = '0' + date }
                    const selectedDate = this.state.year + '-' + month + '-' + date
                    this.props.setDate(selectedDate)
                }} > Add
                </div> {this.state.showRemovebtn ? (<div className="buttons" onClick={() => { this.props.removeDate() }}> Remove </div>) : null}
            </div> </div>)
    }
}
export default DatePicker