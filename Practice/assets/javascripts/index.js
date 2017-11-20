import $ from 'jquery';
import '../less/main.less'; 
import { defineColor } from './commonFunctions.js';
import { filterData, filterStatus, filterSearch } from './filter.js';

var tasks;
var visibleTasks = [];
var quantity = 5;
var currentPage = 1;

$(document).ready(function() {
    // PolyFill for String.includes()
    if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
            'use strict';
            if (typeof start !== 'number') {
                start = 0;
            }
          
            if (start + search.length > this.length) {
                return false;
            } else {
                return this.indexOf(search, start) !== -1;
            }
        };
    }

    $.ajax({
        url: '../json/tasks.json',
        dataType: 'json',
        data: {},
        success: getAllTasks
    })

    $('#data-selector').change(function(){
        filterTasks();
    });
    $('#task-type-selector').change(function(){
        filterTasks();
    });
    $('#filter-form').submit(function(event){
        event.preventDefault();
        filterTasks();
    });

    $('#quantity a').click(function(event) {
        event.preventDefault();
        $('#quantity a').removeClass('active');
        $(this).addClass('active');
        quantity = $(this).attr('value');
        refreshPaginationAndTable();
    });
});

function getAllTasks(data) {
    tasks = data.tasks;
    visibleTasks = tasks;

    refreshPaginationAndTable();
}

function filterTasks() {
    // Uncomment to get  filtered data from server 
    // $.ajax({
    //     // url: '/normal-adress.com/tasks/filtered',
    //     url: '../json/tasks' + $('#data-selector').val() + $('#task-type-selector').val() + $('#search-filter').val() + '.json',
    //     dataType: 'json',
    //     data: {
    //         // Uncomment parameters if needed
    //         createdData: $('#data-selector').val(),
    //         taskStatus: $('#task-type-selector').val(),
    //         searchStr: $('#search-filter').val()
    //     },
    //     success: getAllTasks
    // });

    // This code use if we haven't server side filtration
    visibleTasks = [];
    $.each(tasks, function(i, task) {
        if (filterData(task.created, $('#data-selector').val()) 
            && filterStatus(task.status, $('#task-type-selector').val())
            && filterSearch(task.name, $('#search-filter').val())) {
            visibleTasks.push(task);
        }
    });

    refreshPaginationAndTable();
}

function renderTasks(tasks) {
    $('#task-table').find('tr:not(:first)').remove();

    var tableData = [];
    $.each(tasks, function(i, task) {
        var tr = $('<tr>')
            .append($('<td>')
                .append($('<img>')
                    .attr('src', '../assets/images/t-' + task.T + '.png')
                )
            )
            .append($('<td>').append(task.ticket_id))
            .append($('<td>').addClass('cl3').append(task.name))
            .append($('<td>').addClass(defineColor(task.P)).append('•'))
            .append($('<td>').append(task.status))
            .append($('<td>').append(task.solution))
            .append($('<td>').append(task.created))
            .append($('<td>').append(task.updated))
            .append($('<td>').append(task.deadline))
            .append($('<td>').addClass('cl10').append(
                $('<a>').attr('href', '').append('...')
            ));
        tableData.push(tr);
    });
        
    $("#task-table").find('tbody').append(tableData);
}

function refreshPaginationAndTable() {
    // 
    // $.ajax({
    //     // url: '/normal-adress.com/tasks/filtered/page#',
    //     url: '../json/tasks' + 'page' + $('#pagination a.active').attr('pageNum') + 'quan' + quantity + '.json',
    //     dataType: 'json',
    //     data: {
    //         pageNum: $('#pagination a').attr('pageNum'),
    //         tasksOnPage: quantity
    //     },
    //     success: function(data) {
    //         // Needed variables in data : tasks (tasks on this page), pages (page count), page (current page)
    //         visibleTasks = data.tasks;

    //         $('#pagination a').remove();
    //         for (var i = 1; i <= data.pages; i++) {
    //             var link = $('#pagination').append(
    //                 $('<a>').attr('pageNum', i).attr('href', '').append(i)  
    //             );
    //             if (i == data.page) {
    //                 $('#pagination a').last().addClass('active');
    //             }
    //         }

    //         $('#pagination a').click(function(event) {
    //             event.preventDefault();
    //             $('#pagination a').removeClass('active');
    //             $(this).addClass('active'); 

    //             refreshPaginationAndTable();
    //         });
    
    //         renderTasks(visibleTasks);
    //     }
    // })

    // If haven't sereverside pagination
    $('#pagination a').remove();
    if (quantity !== '-1') {
        // Show first page after init
        renderTasks(visibleTasks.slice(0, quantity));

        for (var i = 1; i <= Math.ceil(visibleTasks.length / quantity); i++) {
            $('#pagination').append(
                $('<a>').attr('pageNum', i).attr('href', '').append(i)  
            );
            if (i == 1) {
                $('#pagination a').first().addClass('active');
            }
        }

        $('#pagination a').click(function(event) {
            event.preventDefault();
    
            // If we can't use server side pagination
            $('#pagination a').removeClass('active');
            $(this).addClass('active'); 
            currentPage = $(this).attr('pageNum');
            var begin = quantity * (currentPage - 1);
            var end = quantity * (currentPage);
            renderTasks(visibleTasks.slice(begin, end));
        });
    } else {
        renderTasks(visibleTasks);
        $('#pagination').append(
            $('<a>').attr('pageNum', 1).attr('href', '').append(1).addClass('active')  
        );
    }
}